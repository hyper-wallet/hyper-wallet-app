export type WalletToken = {
  balance: number;
  metadata: TokenMetadata;
  marketData: TokenMarketData;
};

export type TokenMetadata = {
  mint_address: string;
  decimals: number;
  name: string;
  symbol: string;
  image: string;
};

export type TokenMarketData = {
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  total_supply: number;
};

export type WalletNft = {
  metadata: NftMetadata;
};

export type NftMetadata = {
  name: string;
  description: string;
  symbol: string;
  image_uri: string;
  royalty: number;
  mint: string;
  attributes: {
    [k: string]: string | number;
  };
  owner: string;
  update_authority: string;
  cached_image_uri: string;
  animation_url: string;
  cached_animation_url: string;
  metadata_uri: string;
  creators: any[];
  collection: any;
  attributes_array: any;
  files: any[];
  external_url: string;
  is_loaded_metadata: boolean;
  primary_sale_happened: boolean;
  is_mutable: boolean;
  token_standard: string;
  is_compressed: boolean;
  merkle_tree: string;
  is_burnt: boolean;
  token_record?: any;
};

export type WalletTransaction = {
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

export enum WalletTransactionType {
  TransferLamports,
  TransferSpl,
  TransferNft,
  EnableOtp,
  DisableOtp,
  EnableWhitelist,
  DisableWhitelist,
  Unkown,
}

export type WalletSettings = {
  defaultWallet: "hyper" | "solana";
};
