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
import * as base32 from "base32-ts";
import { getRandomBytes } from "expo-crypto";
import * as totp from "totp-generator";
import { MerkleTree } from "merkletreejs";
//@ts-ignore
import { createHash } from "crypto-browserify";
import { load, save } from "@/utils";

export class HyperWallet implements IWallet {
  private _pda: PublicKey;
  private _owner: SolanaWallet;
  readonly isHyperWallet = true;
  readonly icon = "https://cdn.lu.ma/solana-coin-icons/SOL.png";
  //@ts-ignore
  private _account_data: HyperWalletAccount;

  constructor(owner: SolanaWallet) {
    this._pda = getHyperWalletPda(owner.address);
    this._owner = owner;
  }

  get owner() {
    return this._owner;
  }

  get address() {
    return this._pda.toString();
  }

  get whitelistEnabled() {
    return this._account_data.whitelistEnabled;
  }

  get whitelistedAddresses() {
    return this._account_data.whitelistedAddresses;
  }

  get otpEnabled() {
    return this._account_data.otpEnabled;
  }

  get otpDidSetup() {
    return !!this._account_data.otpInitTime && !!this._account_data.otpRoot;
  }

  async init() {
    this._account_data = await this.getHyperWalletAccount();
  }

  async getHyperWalletAccount(): Promise<HyperWalletAccount> {
    let account: HyperWalletAccount;
    account = await apiService.getHyperWalletAccount(this.address);
    if (!account) {
      await this.createHyperWalletAccount();
    }
    account = await apiService.getHyperWalletAccount(this.address);
    this._account_data = account;
    return account;
  }

  async createHyperWalletAccount() {
    const base64tx = await apiService.constructCreateHyperWalletTx({
      hyperWalletPda: this.address,
      ownerAddress: this.owner.address,
    });
    const recoveredTx = Transaction.from(Buffer.from(base64tx, "base64"));
    const signature = await this.owner.signAndSendTransaction(recoveredTx);
  }

  async closeHyperWalletAccount() {
    const base64tx = await apiService.constructCloseHyperWalletTx({
      hyperWalletPda: this.address,
      ownerAddress: this.owner.address,
    });
    const recoveredTx = Transaction.from(Buffer.from(base64tx, "base64"));
    const signature = await this.owner.signAndSendTransaction(recoveredTx);
  }

  async getTokens(): Promise<WalletToken[]> {
    return apiService.getTokens(this.address);
  }

  async getNfts(): Promise<WalletNft[]> {
    return apiService.getNfts(this.address);
  }

  async getTransactions(lastLoadedSignature?: string) {
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

  async setupOtp() {
    const TOTAL_OTP_CODES_COUNT = Math.pow(2, 20);
    const PERIOD_IN_SECONDS = 30;

    // Generate secret key
    const initTimeInSeconds =
      Math.floor(Date.now() / 1000 / PERIOD_IN_SECONDS) * PERIOD_IN_SECONDS;
    const secretKey = base32.Base32.encode(getRandomBytes(20), "RFC4648");
    // Generate OTP codes + build tree
    const leave_values = [];
    for (let i = 0; i < TOTAL_OTP_CODES_COUNT; i++) {
      const timestamp = (initTimeInSeconds + i * PERIOD_IN_SECONDS) * 1000;
      const otp = totp.TOTP.generate(secretKey, {
        period: PERIOD_IN_SECONDS,
        timestamp,
      }).otp.toString();
      leave_values.push(otp);
    }
    const leave_hashes = leave_values.map((v) =>
      createHash("sha256").update(v).digest()
    );
    const tree = new MerkleTree(leave_hashes, (data: any) =>
      createHash("sha256").update(data).digest()
    );

    // Save tree
    await save("merkle-tree", MerkleTree.marshalTree(tree));

    // Generate link + QR Code
    const otpLink = `otpauth://totp/Hyper%20Wallet:${this.address}?secret=${secretKey}&issuer=Hyper%20Wallet&algorithm=SHA1&digits=6&period=30`;

    // Submit root + init time
    const tx = await apiService.constructSetupOtpTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      initTime: initTimeInSeconds,
      root: tree.getRoot(),
    });
    const recoveredTransaction = Transaction.from(Buffer.from(tx, "base64"));
    const signature = await this.owner.signAndSendTransaction(
      recoveredTransaction
    );
    return { signature, secretKey, otpLink };
  }

  async enableOtp() {
    const base64tx = await apiService.constructEnableOtpTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
    });
    return this._signAndSendTransaction(base64tx);
  }

  async disableOtp() {
    const base64tx = await apiService.constructDisableOtpTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
    });
    return this._signAndSendTransaction(base64tx);
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

  private async _getOtpHashAndProofHash(otp: string | null) {
    if (!this._account_data.otpEnabled || !otp) {
      return {
        otpHash: null,
        proofHash: null,
      };
    }
    const otpHash = createHash("sha256").update(otp).digest();
    const jsonTree = await load("merkle-tree");
    const tree = MerkleTree.unmarshalTree(jsonTree);
    const proof = tree.getProof(otpHash);
    const proofHash = proof.map((v) => Buffer.from(v.data));
    return {
      otpHash,
      proofHash,
    };
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
}
