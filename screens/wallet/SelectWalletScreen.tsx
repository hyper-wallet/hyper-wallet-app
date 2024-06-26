import { Space } from "@/components";
import { useStores } from "@/hooks";
import { ModalStackScreenProps } from "@/navigators";
import { useAppStore } from "@/stores/appStore";
import { palette } from "@/theme/palette";
import { Image } from "expo-image";
import { FC } from "react";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  padding: 16px;
  gap: 16px;
`;

const SolanaWalletCard = styled.TouchableOpacity<{ active: boolean }>`
  /* height: 100px; */
  background-color: ${({ active, theme }) =>
    active ? palette.purple[10] : theme.background.secondary};
  border: 1px solid
    ${({ active, theme }) =>
      active ? palette.purple[30] : theme.background.secondary};
  border-radius: 16px;
  padding: 16px;
`;

const HyperWalletCard = styled.TouchableOpacity<{ active: boolean }>`
  /* height: 100px; */
  background-color: ${({ active, theme }) =>
    active ? palette.green[10] : theme.background.secondary};
  border: 1px solid
    ${({ active, theme }) =>
      active ? palette.green[30] : theme.background.secondary};
  border-radius: 16px;
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.3);
`;

export const SelectWalletScreen: FC<ModalStackScreenProps<"SelectWallet">> = (
  props
) => {
  const { navigation } = props;
  const { appStore, solanaWalletStore, hyperWalletStore } = useStores();
  const { currentWallet, setCurrentWallet } = appStore;
  async function activateSolanaWallet() {
    await setCurrentWallet("solana");
  }
  async function activateHyperWallet() {
    await setCurrentWallet("hyper");
  }

  return (
    <Container>
      <SolanaWalletCard
        active={currentWallet == "solana"}
        onPress={activateSolanaWallet}
      >
        <Image
          source={require("@/assets/images/solana-wallet-icon.png")}
          style={{ width: 48, height: 48 }}
        />
        <Space height={8} />
        <Title>Solana Wallet</Title>
        <Subtitle numberOfLines={1} ellipsizeMode="middle">
          {solanaWalletStore.wallet?.address}
        </Subtitle>
      </SolanaWalletCard>
      <HyperWalletCard
        active={currentWallet == "hyper"}
        onPress={activateHyperWallet}
      >
        <Image
          source={require("@/assets/images/hyper-wallet-icon.png")}
          style={{ width: 48, height: 48 }}
        />
        <Space height={8} />
        <Title>Hyper Wallet</Title>
        <Space height={4} />
        <Subtitle numberOfLines={1} ellipsizeMode="middle">
          {hyperWalletStore.wallet?.address}
        </Subtitle>
      </HyperWalletCard>
    </Container>
  );
};
