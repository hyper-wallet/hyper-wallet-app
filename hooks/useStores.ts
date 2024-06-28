import {
  useAppStore,
  useHyperWalletStore,
  useSolanaWalletStore,
} from "@/stores";
import { useSettingsStore } from "@/stores/settingsStore";

export function useStores() {
  const appStore = useAppStore();
  const hyperWalletStore = useHyperWalletStore();
  const solanaWalletStore = useSolanaWalletStore();
  const settingsStore = useSettingsStore();
  return { appStore, hyperWalletStore, solanaWalletStore, settingsStore };
}
