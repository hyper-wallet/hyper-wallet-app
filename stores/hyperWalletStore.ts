import { HyperWallet } from "@/lib/HyperWallet";
import { SolanaWallet } from "@/lib/SolanaWallet";
import { HyperWalletAccount } from "@/lib/types";
import { WalletNft, WalletToken, WalletTransaction } from "@/types";
import { Connection } from "@solana/web3.js";
import { create } from "zustand";

interface HyperWalletState {
  wallet: HyperWallet | null;
  account: HyperWalletAccount | null;
  tokens: WalletToken[];
  nfts: WalletNft[];
  transactions: WalletTransaction[];
  init: (hyperWallet: HyperWallet) => Promise<void>;
  setAccount: (data: any) => void;
  getTokens: () => Promise<void>;
  getNfts: () => Promise<void>;
  getTransactions: () => Promise<void>;
}

export const useHyperWalletStore = create<HyperWalletState>((set, get) => ({
  tokens: [],
  nfts: [],
  transactions: [],
  wallet: null,
  account: null,
  init: async (hyperWallet: HyperWallet) => {
    const account = await hyperWallet.getOrCreateHyperWalletAccount();
    set({ wallet: hyperWallet, account });
  },
  setAccount: (data: any) => {
    set((s) => ({
      account: {
        ...s.account,
        ...data,
      },
    }));
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
