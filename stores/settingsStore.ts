import { load, save } from "@/utils";
import { create } from "zustand";

interface SettingsState {
  defaultWallet: "hyper" | "solana";
  init: () => Promise<void>;
  setDefaultWallet: (walletType: "hyper" | "solana") => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  defaultWallet: "hyper",
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
