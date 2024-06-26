import { WalletNft, WalletToken, WalletTransactionType } from "@/types";

export type GetHyperWalletAccountResponse = {
  hyperWalletAccount: any;
};

export type GetTokensResponse = {
  tokens: WalletToken[];
};

export type GetNftsResponse = {
  nfts: WalletNft[];
};

export type GetTransactionsResponse = {
  transactions: any[];
};

export type CreateWalletTransactionParams = {
  signature: string;
  type: WalletTransactionType;
  fromAddress: string;
  toAddress: string;
  token: {
    iconUrl: string;
    name: string;
    symbol: string;
    amount: number;
    price: number;
  };
  error?: string;
};

export type ConstructTxReponse = {
  base64tx: string;
};

export type ConstructTransferLamportsTxParams = {
  fromAddress: string;
  toAddress: string;
  lamports: number;
};

export type ConstructTransferSplTxParams = {
  fromAddress: string;
  toAddress: string;
  tokenMintAddress: string;
  rawAmount: number;
  feeToken: FeeToken;
};

export type ConstructTransferNftTxParams = {
  fromAddress: string;
  toAddress: string;
  nftMintAddress: string;
  feeToken: FeeToken;
};

export type ConstructHyperTransferLamportsTxParams = {
  fromHyperWalletPda: string;
  hyperWalletOwnerAddress: string;
  toAddress: string;
  lamports: number;
  approverAddress: string;
};

export type ConstructHyperTransferSplTxParams = {
  fromHyperWalletPda: string;
  hyperWalletOwnerAddress: string;
  toAddress: string;
  tokenMintAddress: string;
  rawAmount: number;
  feeToken: FeeToken;
  approverAddress: string;
};

export type ConstructHyperTransferNftTxParams = {
  fromHyperWalletPda: string;
  hyperWalletOwnerAddress: string;
  toAddress: string;
  nftMintAddress: string;
  feeToken: FeeToken;
  approverAddress: string;
};

export type ConstructOtpSetupParams = {
  hyperWalletPda: string;
  hyperWalletOwnerAddress: string;
  initTime: number;
  root: Buffer;
};

export type ConstructEnableOtpParams = {
  hyperWalletPda: string;
  hyperWalletOwnerAddress: string;
};

export type ConstructDisableOtpParams = {
  hyperWalletPda: string;
  hyperWalletOwnerAddress: string;
};
export type ConstructEnableWhitelistParams = {
  hyperWalletPda: string;
  hyperWalletOwnerAddress: string;
};
export type ConstructDisableWhitelistParams = {
  hyperWalletPda: string;
  hyperWalletOwnerAddress: string;
};
export type ConstructAddToWhitelistParams = {
  hyperWalletPda: string;
  hyperWalletOwnerAddress: string;
  addressToBeAdded: string;
};
export type ConstructRemoveFromWhitelistParams = {
  hyperWalletPda: string;
  hyperWalletOwnerAddress: string;
  addressToBeRemoved: string;
};

export type FeeToken = "USDT" | "SOL";
