import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
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
import * as bs58 from "bs58";
import { HYPER_PROGRAM_ID } from "./constants";

export class HyperWallet implements IWallet {
  private _pda: PublicKey;
  private _owner: SolanaWallet;
  readonly isHyperWallet = true;
  readonly icon = "https://cdn.lu.ma/solana-coin-icons/SOL.png";
  public voters: string[] = [];
  private deviceKeypair: Keypair;
  private cloudKeypair: Keypair;

  constructor(owner: SolanaWallet, devicePk: string, cloudPk: string) {
    this._pda = getHyperWalletPda(owner.address);
    this._owner = owner;
    this.deviceKeypair = Keypair.fromSecretKey(bs58.decode(devicePk));
    this.cloudKeypair = Keypair.fromSecretKey(bs58.decode(cloudPk));
    this.init();
  }

  get owner() {
    return this._owner;
  }

  get address() {
    return this._pda.toString();
  }

  get deviceKeyAddress() {
    return this.deviceKeypair.publicKey.toString();
  }

  get cloudKeyAddress() {
    return this.cloudKeypair.publicKey.toString();
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
    this.voters = account.voters ?? [];
    return account;
  }

  async createHyperWalletAccount() {
    const base64tx = await apiService.constructCreateHyperWalletTx({
      hyperWalletPda: this.address,
      ownerAddress: this.owner.address,
      voters: [
        this.deviceKeypair.publicKey.toString(),
        this.cloudKeypair.publicKey.toString(),
      ],
    });
    const recoveredTx = Transaction.from(Buffer.from(base64tx, "base64"));
    console.log({ recoveredTx });
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
    const { toAddress, lamports, otp } = params;
    const { otpHash, proofHash } = await this._getOtpHashAndProofHash(otp);
    const tx = await apiService.constructHyperTransferLamportsTx({
      fromHyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      toAddress,
      lamports,
      otpHash,
      proofHash,
    });
    const recoveredTransaction = Transaction.from(Buffer.from(tx, "base64"));
    const signature = await this.owner.signAndSendTransaction(
      recoveredTransaction
    );
    return signature;
  }

  async transferSpl(params: TransferSplParams): Promise<Signature> {
    const { toAddress, tokenMintAddress, rawAmount, otp, feeToken } = params;
    const { otpHash, proofHash } = await this._getOtpHashAndProofHash(otp);
    const tx = await apiService.constructHyperTransferSplTx({
      fromHyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      toAddress,
      tokenMintAddress,
      rawAmount,
      otpHash,
      proofHash,
      feeToken,
    });
    const recoveredTransaction = Transaction.from(Buffer.from(tx, "base64"));
    const signature = await this.owner.signAndSendTransaction(
      recoveredTransaction
    );
    return signature;
  }

  async transferNft(params: TransferNftParams): Promise<Signature> {
    const { toAddress, nftMintAddress, otp, feeToken } = params;
    const { otpHash, proofHash } = await this._getOtpHashAndProofHash(otp);
    const tx = await apiService.constructHyperTransferSplTx({
      fromHyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      toAddress,
      tokenMintAddress: nftMintAddress,
      rawAmount: 1,
      otpHash,
      proofHash,
      feeToken,
    });
    const recoveredTransaction = Transaction.from(Buffer.from(tx, "base64"));
    const signature = await this.owner.signAndSendTransaction(
      recoveredTransaction
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
