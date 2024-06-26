import { create } from "zustand";
import { SolanaWallet } from "@/lib/SolanaWallet";
import { HyperWallet } from "@/lib/HyperWallet";
import { networkService, socialAuthService } from "@/services";
import { LOCAL_STORE_KEYS, LocalStore } from "@/utils";
import {
  WalletNft,
  WalletSettings,
  WalletToken,
  WalletTransaction,
} from "@/types";
import { useSolanaWalletStore } from "./solanaWalletStore";
import { useHyperWalletStore } from "./hyperWalletStore";
import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";
import { Approver } from "@/lib/Approver";

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
    // TODO: Recover setttings

    const privateKey =
      socialAuthService.getPrivateKey() ||
      (await LocalStore.get(LOCAL_STORE_KEYS.USER_PK));
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

    // Create or restore device key & cloud key
    let devicePk = await LocalStore.get(LOCAL_STORE_KEYS.DEVICE_PK);
    let cloudPk = await LocalStore.get(LOCAL_STORE_KEYS.CLOUD_PK);
    if (!devicePk) {
      devicePk = bs58.encode(Keypair.generate().secretKey);
      LocalStore.save(LOCAL_STORE_KEYS.DEVICE_PK, devicePk);
    }
    if (!cloudPk) {
      cloudPk = bs58.encode(Keypair.generate().secretKey);
      LocalStore.save(LOCAL_STORE_KEYS.CLOUD_PK, cloudPk);
    }

    const hyperWallet = new HyperWallet(
      solanaWallet,
      new Approver(bs58.encode(Keypair.generate().secretKey)),
      new Approver(cloudPk)
    );
    await hyperWallet.init();

    useSolanaWalletStore.getState().init(solanaWallet);
    await useHyperWalletStore.getState().init(hyperWallet);

    const currentWallet = get().walletSettings.defaultWallet;

    LocalStore.save(LOCAL_STORE_KEYS.USER_PK, privateKey);
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
