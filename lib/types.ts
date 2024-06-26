import { WalletNft, WalletToken } from "@/types";
import { PublicKey } from "@solana/web3.js";

export type HyperWalletAccount = {
  owner: PublicKey;
  approvers: string[];
};

export type ConstructCreateHyperWalletTxParams = {
  hyperWalletPda: string;
  ownerAddress: string;
  approvers: string[];
};

export type ConstructCloseHyperWalletTxParams = {
  hyperWalletPda: string;
  ownerAddress: string;
};

export type ConstructHyperChangeApproverTxParams = {
  hyperWalletPda: string;
  ownerAddress: string;
  newApprover: string;
  approver: string;
};

export type Base64Tx = string;

export type Signature = string;

export type TransferLamportsParams = {
  toAddress: string;
  lamports: number;
};

export type TransferSplParams = {
  toAddress: string;
  tokenMintAddress: string;
  rawAmount: number;
  feeToken: FeeToken;
};

export type TransferNftParams = {
  toAddress: string;
  nftMintAddress: string;
  feeToken: FeeToken;
};

export type FeeToken = "USDT" | "SOL";
