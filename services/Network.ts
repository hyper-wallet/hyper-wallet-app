import { Connection, SendOptions, clusterApiUrl } from "@solana/web3.js";
import INetwork from "./INetwork";

class Network implements INetwork {
  private _connection: Connection;

  constructor() {
    this._connection = new Connection(clusterApiUrl("devnet"));
  }

  get connection() {
    return this._connection;
  }

  async sendRawTransaction(
    rawTransaction: Uint8Array | number[] | Buffer,
    options?: SendOptions | undefined
  ): Promise<string> {
    return this._connection.sendRawTransaction(rawTransaction, options);
  }
}

export default Network;
