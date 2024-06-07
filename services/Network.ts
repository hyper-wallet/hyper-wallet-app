import { Connection, clusterApiUrl } from "@solana/web3.js";
import INetwork from "./INetwork";

class Network implements INetwork {
  private _connection: Connection;

  constructor() {
    this._connection = new Connection(clusterApiUrl("devnet"));
  }

  get connection() {
    return this._connection;
  }
}

export default Network;
