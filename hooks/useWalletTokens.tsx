import { useState, useEffect } from "react";
import { useStores } from "./useStores";

export function useWalletTokens() {
  const [refreshing, setRefreshing] = useState(false);
  const { appStore, hyperWalletStore, solanaWalletStore } = useStores();
  const { currentWallet } = appStore;
  async function load() {
    setRefreshing(true);
    if (currentWallet == "solana") {
      await solanaWalletStore.getTokens();
    } else {
      await hyperWalletStore.getTokens();
    }
    setRefreshing(false);
  }

  useEffect(() => {
    load();
  }, [currentWallet]);

  async function refresh() {
    if (!refreshing) return load();
  }

  return {
    refreshing,
    refresh,
    tokens:
      currentWallet == "hyper"
        ? hyperWalletStore.tokens
        : solanaWalletStore.tokens,
  };
}
