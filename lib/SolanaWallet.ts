import { Connection, Keypair, Transaction } from "@solana/web3.js";
import * as bs58 from "bs58";
import nacl from "tweetnacl";
import { IWallet } from "./interfaces";
import { api } from "@/services";
import {
  Signature,
  TransferLamportsParams,
  TransferNftParams,
  TransferSplParams,
} from "./types";
import { WalletNft, WalletToken, WalletTransaction } from "@/types";

export class SolanaWallet implements IWallet {
  private _signer: Keypair;
  private _connection: Connection;
  readonly isHyperWallet = false;
  readonly icon = "https://cdn.lu.ma/solana-coin-icons/SOL.png";

  constructor(privateKey: string, connection: Connection) {
    let keypair: Keypair;
    if (privateKey.length == 128) {
      // This is a 128-byte hexadecimal private key
      keypair = Keypair.fromSecretKey(Buffer.from(privateKey, "hex"));
    } else {
      const secretKey = bs58.decode(privateKey);
      keypair = Keypair.fromSecretKey(secretKey);
    }
    this._signer = keypair;
    this._connection = connection;
  }

  get signer() {
    return Keypair.fromSecretKey(bs58.decode(this.privateKey.slice(0, 65)));
  }

  get address() {
    return this._signer.publicKey.toString();
  }

  get privateKey() {
    return bs58.encode(this._signer.secretKey);
  }

  async getTokens(): Promise<WalletToken[]> {
    return api.getTokens(this.address);
  }

  async getNfts(): Promise<WalletNft[]> {
    return api.getNfts(this.address);
  }

  async getTransactions(
    lastLoadedSignature?: string
  ): Promise<WalletTransaction[]> {
    const transactions = await api.getTransactions(this.address);
    return transactions;
  }

  async transferLamports(params: TransferLamportsParams): Promise<Signature> {
    const { toAddress, lamports } = params;
    const base64tx = await api.constructTransferLamportsTx({
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
    const base64tx = await api.constructTransferSplTx({
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
    const base64tx = await api.constructTransferNftTx({
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
    const signature = nacl.sign.detached(message, this._signer.secretKey);
    tx.addSignature(this._signer.publicKey, Buffer.from(signature));
    return tx;
  }

  async signAndSendTransaction(tx: Transaction): Promise<string> {
    const signedTx = this.signTransaction(tx);
    const signature = await this._connection.sendRawTransaction(
      signedTx.serialize(),
      { skipPreflight: true }
    );
    return signature;
  }
}
