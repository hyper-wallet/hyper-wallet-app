import { create } from "zustand";
import { SolanaWallet } from "@/lib/SolanaWallet";
import { HyperWallet } from "@/lib/HyperWallet";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import { connection, web3auth } from "@/services";
import { LOGIN_PROVIDER } from "@web3auth/react-native-sdk";
import { load, loadString, save } from "@/utils";
import {
  WalletNft,
  WalletSettings,
  WalletToken,
  WalletTransaction,
} from "@/types";
import { useSolanaWalletStore } from "./solanaWalletStore";
import { useHyperWalletStore } from "./hyperWalletStore";

const resolvedRedirectUrl =
  Constants.appOwnership == AppOwnership.Expo
    ? Linking.createURL("web3auth", {})
    : Linking.createURL("web3auth", { scheme: "hyperwallet" });

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

    const privateKey = web3auth.ed25519Key || (await loadString("private-key"));
    if (privateKey) {
      await get().initWallet(privateKey);
    }
    // Init Stores and Services
    await web3auth.init();

    set({ initialized: true });
  },
  initWallet: async (privateKey: string) => {
    const solanaWallet = new SolanaWallet(privateKey, connection);
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
    await get().initWallet(privateKey);
    set({ creatingWallet: false });
  },
  loginWithGoogle: async () => {
    set({ creatingWallet: true });
    await web3auth.login({
      loginProvider: LOGIN_PROVIDER.GOOGLE,
      redirectUrl: resolvedRedirectUrl,
    });
    const privateKey = web3auth.ed25519Key;
    await get().initWallet(privateKey);
    set({
      creatingWallet: false,
    });
  },
  logout: async () => {
    return web3auth.logout();
  },
  removeWallet: () => {
    try {
      // Clear private key from web3auth
      web3auth.logout();
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
