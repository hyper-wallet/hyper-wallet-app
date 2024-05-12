import { ModalStackScreenProps } from "@/navigators";
import { useAppStore } from "@/stores/appStore";
import { palette } from "@/theme/palette";
import { FC } from "react";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  padding: 16px;
  gap: 16px;
`;

const SolanaWalletCard = styled.TouchableOpacity<{ active: boolean }>`
  height: 100px;
  background-color: ${({ active, theme }) =>
    active ? palette.purple[10] : theme.background.secondary};
  border: 1px solid
    ${({ active, theme }) =>
      active ? palette.purple[30] : theme.background.secondary};
  border-radius: 16px;
  padding: 16px;
`;

const HyperWalletCard = styled.TouchableOpacity<{ active: boolean }>`
  height: 100px;
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

export const SelectWalletScreen: FC<
  ModalStackScreenProps<"SelectWallet">
> = () => {
  const appStore = useAppStore();
  const { solanaWallet, hyperWallet, currentWallet, setCurrentWallet } =
    appStore;
  function activateSolanaWallet() {
    setCurrentWallet(solanaWallet);
  }
  function activateHyperWallet() {
    setCurrentWallet(hyperWallet);
  }

  return (
    <Container>
      <SolanaWalletCard
        active={!currentWallet?.isHyperWallet}
        onPress={activateSolanaWallet}
      >
        <Title>Solana Wallet</Title>
        <Subtitle>This is your Solana wallet</Subtitle>
      </SolanaWalletCard>
      <HyperWalletCard
        active={currentWallet?.isHyperWallet}
        onPress={activateHyperWallet}
      >
        <Title>Hyper Wallet</Title>
        <Subtitle>This is your Hyper wallet</Subtitle>
      </HyperWalletCard>
    </Container>
  );
};
