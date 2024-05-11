import { create } from "zustand";
import { SolanaWallet } from "@/lib/SolanaWallet";
import { HyperWallet } from "@/lib/HyperWallet";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import { api, connection, privateKeyProvider, web3auth } from "@/services";
import { LOGIN_PROVIDER } from "@web3auth/react-native-sdk";
import { IWallet } from "@/lib/interfaces";
import { loadString, saveString } from "@/utils";
import { useSettingsStore } from "./settingsStore";

const resolvedRedirectUrl =
  Constants.appOwnership == AppOwnership.Expo
    ? Linking.createURL("web3auth", {})
    : Linking.createURL("web3auth", { scheme: "hyperwallet" });

interface AppState {
  initialized: boolean;
  solanaWallet: SolanaWallet | null;
  hyperWallet: HyperWallet | null;
  currentWallet: IWallet | null;
  creatingWallet: boolean;
  init: () => void;
  setCurrentWallet: (wallet: IWallet) => void;
  importPrivateKey: (privateKey: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  removeWallet: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  initialized: false,
  solanaWallet: null,
  hyperWallet: null,
  currentWallet: null,
  creatingWallet: false,
  init: async () => {
    await useSettingsStore.getState().init();
    await web3auth.init();
    // Get private key from web3auth or local storage
    const privateKey = web3auth.ed25519Key || (await loadString("private-key"));
    if (privateKey) {
      const solanaWallet = new SolanaWallet(privateKey, connection);
      const hyperWallet = new HyperWallet(solanaWallet);
      await hyperWallet.init();
      const currentWallet =
        useSettingsStore.getState().defaultWallet == "hyper"
          ? hyperWallet
          : solanaWallet;
      set({
        solanaWallet,
        hyperWallet,
        currentWallet,
      });
    }

    set({ initialized: true });
  },
  setCurrentWallet: (wallet: IWallet) => {
    set({ currentWallet: wallet });
    useSettingsStore
      .getState()
      .setDefaultWallet(wallet.isHyperWallet ? "hyper" : "solana");
  },
  importPrivateKey: async (privateKey: string) => {
    set({ creatingWallet: true });
    const solanaWallet = new SolanaWallet(privateKey, connection);
    const hyperWallet = new HyperWallet(solanaWallet);
    await hyperWallet.init();
    saveString("private-key", privateKey);
    const currentWallet =
      useSettingsStore.getState().defaultWallet == "hyper"
        ? hyperWallet
        : solanaWallet;
    set({
      solanaWallet,
      hyperWallet,
      currentWallet,
      creatingWallet: false,
    });
  },
  loginWithGoogle: async () => {
    set({ creatingWallet: true });
    if (!web3auth.ed25519Key) {
      await web3auth.login({
        loginProvider: LOGIN_PROVIDER.GOOGLE,
        redirectUrl: resolvedRedirectUrl,
      });
    }
    const solanaWallet = new SolanaWallet(web3auth.ed25519Key, connection);
    const hyperWallet = new HyperWallet(solanaWallet);
    await hyperWallet.init();
    const currentWallet =
      useSettingsStore.getState().defaultWallet == "hyper"
        ? hyperWallet
        : solanaWallet;
    set({
      solanaWallet,
      hyperWallet,
      currentWallet,
      creatingWallet: false,
    });
  },
  logout: async () => {
    return web3auth.logout();
  },
  removeWallet: () => {
    web3auth.logout();
    set({ solanaWallet: null, hyperWallet: null, currentWallet: null });
  },
}));
