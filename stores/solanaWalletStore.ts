import { SolanaWallet } from "@/lib/SolanaWallet";
import { WalletNft, WalletToken, WalletTransaction } from "@/types";
import { Connection } from "@solana/web3.js";
import { create } from "zustand";

interface SolanaWalletState {
  wallet: SolanaWallet | null;
  tokens: WalletToken[];
  nfts: WalletNft[];
  transactions: WalletTransaction[];
  init: (solanWallet: SolanaWallet) => void;
  getTokens: () => Promise<void>;
  getNfts: () => Promise<void>;
  getTransactions: () => Promise<void>;
}

export const useSolanaWalletStore = create<SolanaWalletState>((set, get) => ({
  tokens: [],
  nfts: [],
  transactions: [],
  wallet: null,
  init: (solanaWallet: SolanaWallet) => {
    set({ wallet: solanaWallet });
  },
  getTokens: async () => {
    const wallet = get().wallet;
    if (!wallet) return;

    const tokens = await wallet.getTokens();
    set({ tokens });
  },
  getNfts: async () => {
    const wallet = get().wallet;
    if (!wallet) return;

    const nfts = await wallet.getNfts();
    set({ nfts });
  },
  getTransactions: async () => {
    const wallet = get().wallet;
    if (!wallet) return;

    const transactions = await wallet.getTransactions();
    set({ transactions });
  },
}));
