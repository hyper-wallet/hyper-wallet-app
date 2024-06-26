import { PublicKey, Transaction } from "@solana/web3.js";
import { SolanaWallet } from "@/lib/SolanaWallet";
import { getHyperWalletPda } from "@/lib/utils";
import IWallet from "./IWallet";
import {
  HyperWalletAccount,
  TransferLamportsParams,
  Signature,
  TransferSplParams,
  TransferNftParams,
} from "./types";
import { apiService } from "@/services";
import { WalletNft, WalletToken } from "@/types";
import { HYPER_PROGRAM_ID } from "./constants";
import { Approver } from "./Approver";

export class HyperWallet implements IWallet {
  readonly isHyperWallet = true;
  readonly icon = "https://cdn.lu.ma/solana-coin-icons/SOL.png";
  private _pda: PublicKey;
  private _owner: SolanaWallet;
  private _voters: string[] = [];
  private _deviceApprover: Approver;
  private _cloudApprover: Approver;

  constructor(
    owner: SolanaWallet,
    deviceApprover: Approver,
    cloudApprover: Approver
  ) {
    this._pda = getHyperWalletPda(owner.address);
    this._owner = owner;
    this._deviceApprover = deviceApprover;
    this._cloudApprover = cloudApprover;
    this.init();
  }

  get owner() {
    return this._owner;
  }

  get address() {
    return this._pda.toString();
  }

  get voters() {
    return this._voters;
  }

  get deviceApprover() {
    return this._deviceApprover;
  }

  get cloudApprover() {
    return this._cloudApprover;
  }

  async init() {
    await this.getOrCreateHyperWalletAccount();
  }

  async getOrCreateHyperWalletAccount(): Promise<HyperWalletAccount> {
    let account: HyperWalletAccount;
    account = await apiService.getHyperWalletAccount(this.address);
    if (!account) {
      await this.createHyperWalletAccount();
    }
    account = await apiService.getHyperWalletAccount(this.address);
    this._voters = account.voters ?? [];
    return account;
  }

  async createHyperWalletAccount() {
    const base64tx = await apiService.constructCreateHyperWalletTx({
      hyperWalletPda: this.address,
      ownerAddress: this.owner.address,
      voters: [this._deviceApprover.address, this._cloudApprover.address],
    });
    const recoveredTx = Transaction.from(Buffer.from(base64tx, "base64"));
    await this.owner.signAndSendTransaction(recoveredTx);
  }

  async closeHyperWalletAccount() {
    const base64tx = await apiService.constructCloseHyperWalletTx({
      hyperWalletPda: this.address,
      ownerAddress: this.owner.address,
    });
    const recoveredTx = Transaction.from(Buffer.from(base64tx, "base64"));
    await this.owner.signAndSendTransaction(recoveredTx);
  }

  async getTokens(): Promise<WalletToken[]> {
    return apiService.getTokens(this.address);
  }

  async getNfts(): Promise<WalletNft[]> {
    return apiService.getNfts(this.address);
  }

  async getTransactions() {
    const transactions = await apiService.getTransactions(this.address);
    return transactions;
  }

  async transferLamports(params: TransferLamportsParams): Promise<Signature> {
    const { toAddress, lamports } = params;
    const approver = this._getValidApprover();
    if (!approver) {
      throw new Error("No Valid Transaction Approver");
    }

    const tx = await apiService.constructHyperTransferLamportsTx({
      fromHyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      toAddress,
      lamports,
      approverAddress: approver.address,
    });
    const recoveredTransaction = Transaction.from(Buffer.from(tx, "base64"));
    const approvedTransaction = approver.signTransaction(recoveredTransaction);
    const signature = await this.owner.signAndSendTransaction(
      approvedTransaction
    );
    return signature;
  }

  async transferSpl(params: TransferSplParams): Promise<Signature> {
    const { toAddress, tokenMintAddress, rawAmount, feeToken } = params;
    const approver = this._getValidApprover();
    if (!approver) {
      throw new Error("No Valid Transaction Approver");
    }

    const tx = await apiService.constructHyperTransferSplTx({
      fromHyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      toAddress,
      tokenMintAddress,
      rawAmount,
      feeToken,
      approverAddress: approver.address,
    });
    const recoveredTransaction = Transaction.from(Buffer.from(tx, "base64"));
    const approvedTransaction =
      this._deviceApprover.signTransaction(recoveredTransaction);
    const signature = await this.owner.signAndSendTransaction(
      approvedTransaction
    );
    return signature;
  }

  async transferNft(params: TransferNftParams): Promise<Signature> {
    const { toAddress, nftMintAddress, feeToken } = params;
    const approver = this._getValidApprover();
    if (!approver) {
      throw new Error("No Valid Transaction Approver");
    }

    const tx = await apiService.constructHyperTransferSplTx({
      fromHyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      toAddress,
      tokenMintAddress: nftMintAddress,
      rawAmount: 1,
      feeToken,
      approverAddress: approver.address,
    });
    const recoveredTransaction = Transaction.from(Buffer.from(tx, "base64"));
    const approvedTransaction =
      this._deviceApprover.signTransaction(recoveredTransaction);
    const signature = await this.owner.signAndSendTransaction(
      approvedTransaction
    );
    return signature;
  }

  async enableWhitelist() {
    const base64tx = await apiService.constructEnableWhitelistTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
    });
    return this._signAndSendTransaction(base64tx);
  }

  async disableWhitelist() {
    const base64tx = await apiService.constructDisableWhitelistTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
    });
    return this._signAndSendTransaction(base64tx);
  }

  async addAddressToWhitelist(address: string) {
    const base64tx = await apiService.constructAddToWhitelistTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      addressToBeAdded: address,
    });
    return this._signAndSendTransaction(base64tx);
  }

  async removeAddressFromWhitelist(address: string) {
    const base64tx = await apiService.constructRemoveFromWhitelistTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      addressToBeRemoved: address,
    });
    return this._signAndSendTransaction(base64tx);
  }

  private _getValidApprover(): Approver | null {
    if (this.voters.includes(this._deviceApprover.address)) {
      return this._deviceApprover;
    }

    if (this.voters.includes(this._cloudApprover.address)) {
      return this._cloudApprover;
    }

    return null;
  }

  private async _signAndSendTransaction(base64tx: string): Promise<string> {
    const recoveredTransaction = Transaction.from(
      Buffer.from(base64tx, "base64")
    );
    const signature = await this.owner.signAndSendTransaction(
      recoveredTransaction
    );
    return signature;
  }

  static deriveAddressFromOwner(ownerAddress: string) {
    const [pda] = PublicKey.findProgramAddressSync(
      [new PublicKey(ownerAddress).toBuffer()],
      new PublicKey(HYPER_PROGRAM_ID)
    );
    return pda.toString();
  }

  static async hyperWalletAccountExisted(hyperWalletAddress: string) {
    const account = await apiService.getHyperWalletAccount(hyperWalletAddress);
    return !!account;
  }
}
