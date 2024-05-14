import { WalletNft, WalletToken } from "@/types";
import { PublicKey } from "@solana/web3.js";

export type HyperWalletAccount = {
  owner: PublicKey;
  whitelistEnabled: boolean;
  whitelistedAddresses: string[];
  otpEnabled: boolean;
  otpRoot: Buffer;
  otpInitTime: number;
  spendingLimit: number;
};

export type ConstructCreateHyperWalletTxParams = {
  hyperWalletPda: string;
  ownerAddress: string;
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
  otp?: string;
};

export type TransferSplParams = {
  toAddress: string;
  tokenMintAddress: string;
  rawAmount: number;
  otp?: string;
  feeToken: "sol" | "usdt";
};

export type TransferNftParams = {
  toAddress: string;
  nftMintAddress: string;
  otp?: string;
  feeToken: "sol" | "usdt";
};
