import { WalletNft, WalletToken } from "@/types";
import { PublicKey } from "@solana/web3.js";

export type HyperWalletAccount = {
  owner: PublicKey;
  voters: string[];
};

export type ConstructCreateHyperWalletTxParams = {
  hyperWalletPda: string;
  ownerAddress: string;
  voters: string[];
};

export type ConstructCloseHyperWalletTxParams = {
  hyperWalletPda: string;
  ownerAddress: string;
};

export type Base64Tx = string;

export type Signature = string;

export type TransferLamportsParams = {
  toAddress: string;
  lamports: number;
  otp: string | null;
};

export type TransferSplParams = {
  toAddress: string;
  tokenMintAddress: string;
  rawAmount: number;
  otp: string | null;
  feeToken: "sol" | "usdt";
};

export type TransferNftParams = {
  toAddress: string;
  nftMintAddress: string;
  otp: string | null;
  feeToken: "sol" | "usdt";
};
