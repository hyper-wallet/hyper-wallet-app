import { WalletNft, WalletToken, WalletTransaction } from "@/types";
import {
  TransferLamportsParams,
  TransferNftParams,
  TransferSplParams,
  Signature,
} from "./types";

interface IWallet {
  get address(): string;
  readonly isHyperWallet: boolean;
  readonly icon: string;
  getTokens(): Promise<WalletToken[]>;
  getNfts(): Promise<WalletNft[]>;
  getTransactions(): Promise<WalletTransaction[]>;
  transferLamports(params: TransferLamportsParams): Promise<Signature>;
  transferSpl(params: TransferSplParams): Promise<Signature>;
  transferNft(params: TransferNftParams): Promise<Signature>;
}

export default IWallet;
