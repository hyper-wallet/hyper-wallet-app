import { useState, useEffect } from "react";
import { WalletNft } from "@/types";
import { useAppStore } from "@/stores/appStore";

export function useWalletNfts() {
  const [refreshing, setRefreshing] = useState(true);
  const [nfts, setNfts] = useState<WalletNft[]>([]);
  const { currentWallet } = useAppStore();

  function load() {
    setRefreshing(true);
    currentWallet
      .getNfts()
      .then((nfts) => {
        setNfts(nfts);
      })
      .catch((e) => console.error(e))
      .finally(() => setRefreshing(false));
  }

  useEffect(() => {
    if (!currentWallet) {
      return;
    }
    load();
  }, [currentWallet]);

  return {
    refreshing,
    refresh: load,
    nfts,
  };
}
