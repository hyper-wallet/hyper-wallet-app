import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import { api } from "@/services";
import { WalletTransaction } from "@/types";

export function useTransactions() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const { currentWallet } = useAppStore();

  const refresh = () => {
    setRefreshing(true);
    currentWallet
      ?.getTransactions()
      .then((data) => {
        console.log("🚀 ~ .then ~ data:", data);
        setTransactions(data);
      })
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    if (!currentWallet) {
      return;
    }

    refresh();
  }, [currentWallet]);

  const loadMore = () => {
    if (!hasMore || loading) {
      return;
    }
    setLoading(true);
    // api
    //   .getTransactionsInfos({
    //     cursor: nextPage,
    //     walletAddress: currentWallet.address,
    //   })
    //   .then((res) => {
    //     setTransactions((t) => [...t, ...res.entries]);
    //     setHasMore(res.has_more);
    //     setNextPage(res.next_cursor);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  return {
    loading,
    refreshing,
    refresh,
    loadMore,
    transactions,
  };
}
