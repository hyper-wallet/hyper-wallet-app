import { useState, useEffect } from "react";
import { useStores } from "./useStores";

export function useWalletNfts() {
  const [refreshing, setRefreshing] = useState(false);
  const { appStore, hyperWalletStore, solanaWalletStore } = useStores();
  const { currentWallet } = appStore;

  async function load() {
    setRefreshing(true);
    await Promise.all([
      hyperWalletStore.getNfts(),
      solanaWalletStore.getNfts(),
    ]);
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
    nfts:
      currentWallet == "hyper" ? hyperWalletStore.nfts : solanaWalletStore.nfts,
  };
}
