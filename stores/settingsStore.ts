import { load, save } from "@/utils";
import { create } from "zustand";

interface SettingsState {
  defaultWallet: "hyper" | "solana";
  explorer: "solana" | "solscan" | "solanaFm";
  network: "mainnet" | "devnet" | "testnet";
  init: () => Promise<void>;
  setDefaultWallet: (walletType: "hyper" | "solana") => void;
  setExplorer: (explorer: "solana" | "solscan" | "solanaFm") => void;
  setNetwork: (network: "mainnet" | "devnet" | "testnet") => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  defaultWallet: "hyper",
  explorer: "solana",
  network: "devnet",
  init: async () => {
    const savedSettings = await loadSettings();
    if (!savedSettings) {
      saveSettings({ defaultWallet: "hyper" });
    } else {
      const { defaultWallet } = savedSettings;
      set({ defaultWallet });
    }
  },
  setDefaultWallet: (walletType: "hyper" | "solana") => {
    set({ defaultWallet: walletType });
    saveSettings({ defaultWallet: walletType });
  },
  setExplorer(explorer) {
    set({ explorer });
    saveSettings({ explorer });
  },
  setNetwork(network) {
    set({ network });
    saveSettings({ network });
  },
}));

async function loadSettings() {
  return load("settings");
}

async function saveSettings(newSettings: any) {
  const savedSettings = await load("settings");
  return save("settings", {
    ...savedSettings,
    ...newSettings,
  });
}
