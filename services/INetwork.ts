import { Connection, SendOptions, TransactionSignature } from "@solana/web3.js";

interface INetwork {
  get connection(): Connection;
  sendRawTransaction(
    rawTransaction: Buffer | Uint8Array | Array<number>,
    options?: SendOptions
  ): Promise<TransactionSignature>;
}

export default INetwork;
