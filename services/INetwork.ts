import { Connection } from "@solana/web3.js";

interface INetwork {
  get connection(): Connection;
}

export default INetwork;
