import {
  useAppStore,
  useHyperWalletStore,
  useSolanaWalletStore,
} from "@/stores";

export function useStores() {
  const appStore = useAppStore();
  const hyperWalletStore = useHyperWalletStore();
  const solanaWalletStore = useSolanaWalletStore();
  return { appStore, hyperWalletStore, solanaWalletStore };
}
