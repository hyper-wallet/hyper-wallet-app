import { Keypair, Transaction } from "@solana/web3.js";
import * as bs58 from "bs58";
import nacl from "tweetnacl";

export class Approver {
  private _keypair: Keypair;

  constructor(privateKey: string) {
    let _keypair: Keypair;
    if (privateKey.length == 128) {
      // This is a 128-byte hexadecimal private key
      _keypair = Keypair.fromSecretKey(Buffer.from(privateKey, "hex"));
    } else {
      const secretKey = bs58.decode(privateKey);
      _keypair = Keypair.fromSecretKey(secretKey);
    }
    this._keypair = _keypair;
  }

  get address() {
    return this._keypair.publicKey.toString();
  }

  signTransaction(tx: Transaction): Transaction {
    const message = tx.serializeMessage();
    const signature = nacl.sign.detached(message, this._keypair.secretKey);
    tx.addSignature(this._keypair.publicKey, Buffer.from(signature));
    return tx;
  }
}
