import { FC, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  RefreshControl,
} from "react-native";
import { RootTabScreenProps } from "@/navigators";
import { styled } from "styled-components/native";
import { TokenItem } from "./TokenItem";
import { Button } from "./Button";
import { WalletToken } from "@/types";
import { useAppStore } from "@/stores/appStore";

const Balance = styled.Text`
  font-weight: 600;
  font-size: 48px;
  text-align: center;
  margin-top: 32px;
  color: ${({ theme }) => theme.foreground.primary};
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 32px;
`;

export const WalletScreen: FC<RootTabScreenProps<"Wallet">> = ({
  navigation,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const { currentWallet, walletTokens, getTokens } = useAppStore();

  const tokens = Array.from(walletTokens.values());
  const usdBalance = tokens.reduce((prev, token) => {
    const { balance, price } = token;
    return prev + balance * price.usd;
  }, 0);

  useEffect(() => {
    refresh();
  }, [currentWallet]);

  const viewTokenDetail = (mint_address: string) => {
    navigation.navigate("ModalStack", {
      screen: "TokenDetails",
      params: {
        mint_address,
      },
    });
  };

  const selectSendToken = () => {
    navigation.navigate("ModalStack", {
      screen: "SelectSendToken",
    });
  };

  const viewWalletAddress = () => {
    navigation.navigate("ModalStack", {
      screen: "WalletAddress",
    });
  };

  const swap = () => {
    Linking.openURL("https://raydium.io/swap");
  };

  const buy = () => {
    Linking.openURL("https://www.moonpay.com/buy/sol");
  };

  async function refresh() {
    setRefreshing(true);
    await getTokens();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <Balance>${usdBalance.toFixed(2)}</Balance>
        <ButtonsRow>
          <Button
            iconName="ri-arrow-right-up-line"
            label="Send"
            onPress={selectSendToken}
          />
          <Button
            iconName="ri-arrow-left-down-line"
            label="Receive"
            onPress={viewWalletAddress}
          />
          <Button
            iconName="ri-arrow-left-right-line"
            label="Swap"
            onPress={swap}
          />
          <Button iconName="ri-add-line" label="Buy" onPress={buy} />
        </ButtonsRow>
        {tokens.map((token) => (
          <TokenItem
            key={token.metadata.mint_address}
            {...token}
            onPress={() => viewTokenDetail(token.metadata.mint_address)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
