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
    account = await api.getHyperWalletAccount(this.address);
    if (!account) {
      await this.createHyperWalletAccount();
    }
    account = await api.getHyperWalletAccount(this.address);
    this._account_data = account;
    return account;
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

  async getTransactions(lastLoadedSignature?: string) {
    const transactions = await api.getTransactions(this.address);
    return transactions;
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
      feeToken: "sol",
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
    // TODO: round init time to be a multiple of period
    const initTimeInSeconds =
      Math.floor(Date.now() / 1000 / PERIOD_IN_SECONDS) * PERIOD_IN_SECONDS;
    console.log(
      "🚀 ~ HyperWallet ~ setupOtp ~ initTimeInSeconds:",
      new Date(initTimeInSeconds * 1000)
    );
    const secretKey = base32.Base32.encode(getRandomBytes(20), "RFC4648");
    // Generate OTP codes + build tree
    const leave_values = [];
    let count = 0;
    for (let i = 0; i < TOTAL_OTP_CODES_COUNT; i++) {
      const timestamp = (initTimeInSeconds + i * PERIOD_IN_SECONDS) * 1000;
      const otp = totp.TOTP.generate(secretKey, {
        period: PERIOD_IN_SECONDS,
        timestamp,
      }).otp.toString();
      if (count <= 10) {
        console.log(new Date(timestamp).getMinutes(), otp);
      }
      count++;
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
    const otpLink = `otpauth://totp/Hyper%Wallet:${this.address}?secret=${secretKey}&issuer=Hyper%20Wallet&algorithm=SHA1&digits=6&period=30`;

    // Submit root + init time
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
    return { signature, secretKey, otpLink };
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
  async addAddressToWhitelist(address: string) {
    console.log("🚀 ~ HyperWallet ~ addAddressToWhitelist ~ address:", address);
    const base64tx = await api.constructAddToWhitelistTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      addressToBeAdded: address,
    });
    console.log(
      "🚀 ~ HyperWallet ~ addAddressToWhitelist ~ base64tx:",
      base64tx
    );
    return this._signAndSendTransaction(base64tx);
  }
  async removeAddressFromWhitelist(address: string) {
    const base64tx = await api.constructRemoveFromWhitelistTx({
      hyperWalletPda: this.address,
      hyperWalletOwnerAddress: this.owner.address,
      addressToBeRemoved: address,
    });
    return this._signAndSendTransaction(base64tx);
  }

  private async _getOtpHashAndProofHash(otp: string | null) {
    if (!this._account_data.otpEnabled || !otp) {
      console.log(
        "🚀 ~ HyperWallet ~ _getOtpHashAndProofHash ~ otpEnabled:",
        this.otpEnabled
      );
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
