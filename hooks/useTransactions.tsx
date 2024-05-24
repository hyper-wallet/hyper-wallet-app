import { useState, useEffect } from "react";
import { useStores } from "./useStores";

export function useTransactions() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastLoadedSignature, setLastLoadedSignature] = useState<
    string | undefined
  >();
  const { appStore, hyperWalletStore, solanaWalletStore } = useStores();

  async function refresh() {
    setRefreshing(true);
    if (appStore.currentWallet == "solana") {
      await solanaWalletStore.getTransactions();
    } else {
      await hyperWalletStore.getTransactions();
    }
    setRefreshing(false);
  }

  useEffect(() => {
    refresh();
  }, [appStore.currentWallet]);

  async function loadMore() {
    // if (loading) {
    //   return;
    // }
    // setLoading(true);
    // if (appStore.currentWallet == "solana") {
    //   await solanaWalletStore.getTransactions(lastLoadedSignature);
    //   setLastLoadedSignature(solanaWalletStore.transactions.at(-1)?.signature);
    // } else {
    //   await hyperWalletStore.getTransactions(lastLoadedSignature);
    //   setLastLoadedSignature(solanaWalletStore.transactions.at(-1)?.signature);
    // }
    // setLoading(false);
  }

  return {
    loading,
    refreshing,
    refresh,
    loadMore,
    transactions:
      appStore.currentWallet == "hyper"
        ? hyperWalletStore.transactions
        : solanaWalletStore.transactions,
  };
}
