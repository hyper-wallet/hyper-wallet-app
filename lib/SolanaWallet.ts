import { Keypair, Transaction } from "@solana/web3.js";
import * as bs58 from "bs58";
import nacl from "tweetnacl";
import IWallet from "./IWallet";
import { apiService } from "@/services";
import {
  Signature,
  TransferLamportsParams,
  TransferNftParams,
  TransferSplParams,
} from "./types";
import { WalletNft, WalletToken, WalletTransaction } from "@/types";
import Network from "@/services/Network";

export class SolanaWallet implements IWallet {
  private _keypair: Keypair;
  private _network: Network;
  readonly isHyperWallet = false;
  readonly icon = "https://cdn.lu.ma/solana-coin-icons/SOL.png";

  constructor(privateKey: string, network: Network) {
    this._keypair = SolanaWallet.getKeypairFromPrivateKey(privateKey);
    this._network = network;
  }

  get address() {
    return this._keypair.publicKey.toString();
  }

  async getTokens(): Promise<WalletToken[]> {
    return apiService.getTokens(this.address);
  }

  async getNfts(): Promise<WalletNft[]> {
    return apiService.getNfts(this.address);
  }

  async getTransactions(): Promise<WalletTransaction[]> {
    const transactions = await apiService.getTransactions(this.address);
    return transactions;
  }

  async transferLamports(params: TransferLamportsParams): Promise<Signature> {
    const { toAddress, lamports } = params;
    const base64tx = await apiService.constructTransferLamportsTx({
      fromAddress: this.address,
      toAddress,
      lamports,
    });
    const recoveredTx = Transaction.from(Buffer.from(base64tx, "base64"));
    const singature = await this.signAndSendTransaction(recoveredTx);
    return singature;
  }

  async transferSpl(params: TransferSplParams): Promise<Signature> {
    const { toAddress, tokenMintAddress, rawAmount, feeToken } = params;
    const base64tx = await apiService.constructTransferSplTx({
      fromAddress: this.address,
      toAddress,
      tokenMintAddress,
      rawAmount,
      feeToken,
    });
    const recoveredTx = Transaction.from(Buffer.from(base64tx, "base64"));
    const signature = await this.signAndSendTransaction(recoveredTx);
    return signature;
  }

  async transferNft(params: TransferNftParams): Promise<Signature> {
    const { toAddress, nftMintAddress, feeToken } = params;
    const base64tx = await apiService.constructTransferNftTx({
      fromAddress: this.address,
      toAddress,
      nftMintAddress,
      feeToken,
    });
    const recoveredTx = Transaction.from(Buffer.from(base64tx, "base64"));
    const signature = await this.signAndSendTransaction(recoveredTx);
    return signature;
  }

  signTransaction(tx: Transaction): Transaction {
    const message = tx.serializeMessage();
    const signature = nacl.sign.detached(message, this._keypair.secretKey);
    tx.addSignature(this._keypair.publicKey, Buffer.from(signature));
    return tx;
  }

  async signAndSendTransaction(tx: Transaction): Promise<string> {
    const signedTx = this.signTransaction(tx);
    const signature = await this._network.sendRawTransaction(
      signedTx.serialize()
      // { skipPreflight: true },
    );
    return signature;
  }

  static getAddressFromPrivateKey(privateKey: string) {
    return SolanaWallet.getKeypairFromPrivateKey(
      privateKey
    ).publicKey.toString();
  }

  static getKeypairFromPrivateKey(privateKey: string): Keypair {
    let keypair: Keypair;
    if (privateKey.length == 128) {
      // This is a 128-byte hexadecimal private key
      keypair = Keypair.fromSecretKey(Buffer.from(privateKey, "hex"));
    } else {
      const secretKey = bs58.decode(privateKey);
      keypair = Keypair.fromSecretKey(secretKey);
    }
    return keypair;
  }
}
