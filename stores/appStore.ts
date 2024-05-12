import { create } from "zustand";
import { SolanaWallet } from "@/lib/SolanaWallet";
import { HyperWallet } from "@/lib/HyperWallet";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import { connection, web3auth } from "@/services";
import { LOGIN_PROVIDER } from "@web3auth/react-native-sdk";
import { IWallet } from "@/lib/interfaces";
import { clear, load, loadString, save, saveString } from "@/utils";
import {
  WalletNft,
  WalletSettings,
  WalletToken,
  WalletTransaction,
} from "@/types";

const resolvedRedirectUrl =
  Constants.appOwnership == AppOwnership.Expo
    ? Linking.createURL("web3auth", {})
    : Linking.createURL("web3auth", { scheme: "hyperwallet" });

interface AppState {
  initialized: boolean;
  authenticated: boolean;
  solanaWallet: SolanaWallet | null;
  hyperWallet: HyperWallet | null;
  currentWallet: IWallet | null;
  creatingWallet: boolean;
  walletTokens: Map<string, WalletToken>;
  walletNfts: WalletNft[];
  walletTransactions: WalletTransaction[];
  walletSettings: WalletSettings;
  init: () => Promise<void>;
  initWallet: (privateKey: string) => Promise<void>;
  getTokens: () => Promise<void>;
  getNfts: () => Promise<void>;
  getTransactions: () => Promise<void>;
  setCurrentWallet: (wallet: IWallet) => void;
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
  currentWallet: null,
  creatingWallet: false,
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
    await hyperWallet.init();
    const currentWallet =
      get().walletSettings.defaultWallet == "hyper"
        ? hyperWallet
        : solanaWallet;
    set({
      solanaWallet,
      hyperWallet,
      currentWallet,
    });
  },
  setCurrentWallet: (wallet: IWallet) => {
    set({ currentWallet: wallet });
    get().getTokens();
    get().getNfts();
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
      web3auth.logout();
      set({ solanaWallet: null, hyperWallet: null, currentWallet: null });
    } catch (e) {
      console.log(e);
    }
  },
  reset: async () => {
    await clear();
  },
  getTokens: async () => {
    const currentWallet = get().currentWallet;
    if (!currentWallet) return;

    const tokens = await currentWallet.getTokens();
    const walletTokens = new Map();
    tokens.map((token) => walletTokens.set(token.metadata.mint_address, token));
    set({ walletTokens });
  },
  getNfts: async () => {
    const currentWallet = get().currentWallet;
    if (!currentWallet) return;

    const nfts = await currentWallet.getNfts();
    set({ walletNfts: nfts });
  },
  getTransactions: async () => {
    const currentWallet = get().currentWallet;
    if (!currentWallet) return;
    currentWallet.getTransactions().then((data) => {
      set({ walletTransactions: data });
    });
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
