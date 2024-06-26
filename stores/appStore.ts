import { create } from "zustand";
import { SolanaWallet } from "@/lib/SolanaWallet";
import { HyperWallet } from "@/lib/HyperWallet";
import { networkService, socialAuthService } from "@/services";
import { load, loadString, save, saveString } from "@/utils";
import {
  WalletNft,
  WalletSettings,
  WalletToken,
  WalletTransaction,
} from "@/types";
import { useSolanaWalletStore } from "./solanaWalletStore";
import { useHyperWalletStore } from "./hyperWalletStore";

interface AppState {
  initialized: boolean;
  authenticated: boolean;
  currentWallet: "solana" | "hyper";
  creatingWallet: boolean;
  hasWallet: boolean;
  walletTokens: Map<string, WalletToken>;
  walletNfts: WalletNft[];
  walletTransactions: WalletTransaction[];
  walletSettings: WalletSettings;
  init: () => Promise<void>;
  initWallet: (privateKey: string) => Promise<void>;
  setCurrentWallet: (wallet: "hyper" | "solana") => Promise<void>;
  importPrivateKey: (privateKey: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  removeWallet: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  initialized: false,
  authenticated: false,
  solanaWallet: null,
  hyperWallet: null,
  currentWallet: "hyper",
  creatingWallet: false,
  hasWallet: false,
  walletTokens: new Map(),
  walletNfts: [],
  walletTransactions: [],
  walletSettings: {
    defaultWallet: "hyper",
  },
  init: async () => {
    // Recover settings
    const savedSettings = await getSettings();
    if (!savedSettings) {
      saveSettings({ defaultWallet: "hyper" });
    } else {
      set({ walletSettings: savedSettings });
    }

    const privateKey =
      socialAuthService.getPrivateKey() || (await loadString("private-key"));
    if (privateKey) {
      await get().initWallet(privateKey);
    }
    // Init Stores and Services
    await socialAuthService.init();

    set({ initialized: true });
  },
  initWallet: async (privateKey: string) => {
    const solanaWallet = new SolanaWallet(
      privateKey,
      networkService.connection
    );
    const hyperWallet = new HyperWallet(solanaWallet);

    useSolanaWalletStore.getState().init(solanaWallet);
    await useHyperWalletStore.getState().init(hyperWallet);

    const currentWallet = get().walletSettings.defaultWallet;
    set({
      currentWallet,
      hasWallet: true,
    });
  },
  setCurrentWallet: async (wallet: "hyper" | "solana") => {
    set({ currentWallet: wallet });
  },
  importPrivateKey: async (privateKey: string) => {
    set({ creatingWallet: true });
    saveString("private-key", privateKey);
    await get().initWallet(privateKey);
    set({ creatingWallet: false });
  },
  loginWithGoogle: async () => {
    set({ creatingWallet: true });
    await socialAuthService.loginWithGoogle();
    const privateKey = socialAuthService.getPrivateKey();
    await get().initWallet(privateKey);
    set({
      creatingWallet: false,
    });
  },
  logout: async () => {
    return socialAuthService.logout();
  },
  removeWallet: () => {
    try {
      // Logout from social auth service
      socialAuthService.logout();
      // Clear private key from storage
      set({ hasWallet: false });
    } catch (e) {
      console.log(e);
    }
  },
}));

async function saveSettings(newSettings: any) {
  const savedSettings = await load("settings");
  return save("settings", {
    ...savedSettings,
    ...newSettings,
  });
}

async function getSettings() {
  return load("settings");
}
