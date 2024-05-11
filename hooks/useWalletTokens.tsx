import { useState, useEffect } from "react";
import { WalletToken } from "@/types";
import { useAppStore } from "@/stores/appStore";

let interval: NodeJS.Timeout;

export function useWalletTokens() {
  const [refreshing, setRefreshing] = useState(false);
  const [usdBalance, setUsdBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<WalletToken[]>([]);
  const appStore = useAppStore();
  const { currentWallet } = appStore;
  const load = () => {
    setRefreshing(true);
    currentWallet
      .getTokens()
      .then((data) => {
        setTokens(data);
        let usdBalance = 0;
        data.forEach((token) => {
          const { balance, price } = token;
          usdBalance += balance * price.usd;
        });
        setUsdBalance(usdBalance);
      })
      .catch((error) => {})
      .finally(() => {
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (!currentWallet) {
      return;
    }

    load();

    interval = setInterval(load, 60 * 1000);

    return () => {
      interval && clearInterval(interval);
    };
  }, [currentWallet]);

  const refresh = () => {
    if (refreshing || !currentWallet) {
      return;
    }
    load();
  };

  return {
    refreshing,
    refresh,
    usdBalance,
    tokens,
  };
}
