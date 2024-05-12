import { PublicKey, Transaction } from "@solana/web3.js";
import { SolanaWallet } from "@/lib/SolanaWallet";
import { getHyperWalletPda } from "@/lib/utils";
import { IWallet } from "./interfaces";
import {
  HyperWalletAccount,
  TransferLamportsParams,
  Signature,
  TransferSplParams,
  TransferNftParams,
} from "./types";
import { api } from "@/services";
import { WalletNft, WalletToken } from "@/types";
import * as base32 from "base32-ts";
import { getRandomBytes } from "expo-crypto";
import * as totp from "totp-generator";
import { MerkleTree } from "merkletreejs";
import { createHash } from "crypto-browserify";
import { load, save } from "@/utils";

export class HyperWallet implements IWallet {
  private _pda: PublicKey;
  private _owner: SolanaWallet;
  readonly isHyperWallet = true;
  readonly icon = "https://cdn.lu.ma/solana-coin-icons/SOL.png";
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
    let account: HyperWalletAccount;

    account = await this.getHyperWalletAccount();
    if (!account) {
      await this.createHyperWalletAccount();
    }

    account = await this.getHyperWalletAccount();
    console.log("🚀 ~ HyperWallet ~ init ~ account:", account);
    this._account_data = account;
  }

  async getHyperWalletAccount(): Promise<HyperWalletAccount> {
    return api.getHyperWalletAccount(this.address);
  }

  async createHyperWalletAccount() {
    const base64tx = await api.constructCreateHyperWalletTx({
      hyperWalletPda: this.address,
      ownerAddress: this.owner.address,
    });
    const recoveredTx = Transaction.from(Buffer.from(base64tx, "base64"));
    const signature = await this.owner.signAndSendTransaction(recoveredTx);
  }

  async closeHyperWalletAccount() {
    const base64tx = await api.constructCloseHyperWalletTx({
      hyperWalletPda: this.address,
      ownerAddress: this.owner.address,
    });
    const recoveredTx = Transaction.from(Buffer.from(base64tx, "base64"));
    const signature = await this.owner.signAndSendTransaction(recoveredTx);
  }

  async getTokens(): Promise<WalletToken[]> {
    return api.getTokens(this.address);
  }

  async getNfts(): Promise<WalletNft[]> {
    return api.getNfts(this.address);
  }

  async getTransactions() {
    return api.getTransactions(this.address);
  }

  async transferLamports(params: TransferLamportsParams): Promise<Signature> {
    const { toAddress, lamports, otp } = params;
    const { otpHash, proofHash } = await this._getOtpHashAndProofHash(otp);
    const tx = await api.constructHyperTransferLamportsTx({
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
    const { toAddress, tokenMintAddress, rawAmount, otp } = params;
    const { otpHash, proofHash } = await this._getOtpHashAndProofHash(otp);
    const tx = await api.constructHyperTransferSplTx({
      fromHyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      toAddress,
      tokenMintAddress,
      rawAmount,
      otpHash,
      proofHash,
    });
    const recoveredTransaction = Transaction.from(Buffer.from(tx, "base64"));
    const signature = await this.owner.signAndSendTransaction(
      recoveredTransaction
    );
    return signature;
  }

  async transferNft(params: TransferNftParams): Promise<Signature> {
    const { toAddress, nftMintAddress, otp } = params;
    const { otpHash, proofHash } = await this._getOtpHashAndProofHash(otp);
    const tx = await api.constructHyperTransferNftTx({
      fromHyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      toAddress,
      nftMintAddress,
      otpHash,
      proofHash,
    });
    const recoveredTransaction = Transaction.from(Buffer.from(tx, "base64"));
    const signature = await this.owner.signAndSendTransaction(
      recoveredTransaction
    );
    return signature;
  }

  async setupOtp() {
    const TOTAL_OTP_CODES_COUNT = Math.pow(2, 10);
    const PERIOD_IN_SECONDS = 30;
    // Generate secret key
    const initTimeInSeconds = Math.floor(Date.now() / 1000);
    const secretKey = base32.Base32.encode(getRandomBytes(20), "RFC4648");
    // Generate OTP codes + build tree
    const leave_values = [];
    for (let i = 0; i < TOTAL_OTP_CODES_COUNT; i++) {
      const otp = totp.TOTP.generate(secretKey, {
        period: PERIOD_IN_SECONDS,
        timestamp: (initTimeInSeconds + i * PERIOD_IN_SECONDS) * 1000,
      }).otp.toString();
      leave_values.push(otp);
    }
    const leave_hashes = leave_values.map((v) =>
      createHash("sha256").update(v).digest()
    );
    const tree = new MerkleTree(leave_hashes, (data) =>
      createHash("sha256").update(data).digest()
    );

    // Save tree
    await save("merkle-tree", MerkleTree.marshalTree(tree));

    // Generate link + QR Code
    const otpLink = `otpauth://totp/Hyper%Wallet:${this.address}?secret=${secretKey}&issuer=Hyper%20Wallet&algorithm=SHA1&digits=6&period=30`;
    // Submit root + init time
    console.log("🚀 ~ HyperWallet ~ setupOtp ~ otpLink:", otpLink);

    const tx = await api.constructSetupOtpTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      initTime: initTimeInSeconds,
      root: tree.getRoot(),
    });
    const recoveredTransaction = Transaction.from(Buffer.from(tx, "base64"));
    const signature = await this.owner.signAndSendTransaction(
      recoveredTransaction
    );
    return signature;
  }

  async enableOtp() {
    const base64tx = await api.constructEnableOtpTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
    });
    return this._signAndSendTransaction(base64tx);
  }

  async disableOtp() {
    const base64tx = await api.constructDisableOtpTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
    });
    return this._signAndSendTransaction(base64tx);
  }
  async enableWhitelist() {
    const base64tx = await api.constructEnableWhitelistTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
    });
    return this._signAndSendTransaction(base64tx);
  }
  async disableWhitelist() {
    const base64tx = await api.constructDisableWhitelistTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
    });
    return this._signAndSendTransaction(base64tx);
  }

  private async _getOtpHashAndProofHash(otp: string) {
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
    this.init();
    return signature;
  }
}
