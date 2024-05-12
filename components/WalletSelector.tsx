import { useAppStore } from "@/stores/appStore";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { Icon } from "./Icon";
import { Image } from "./Image";

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const WalletIcon = styled(Image)`
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.background.primary};
`;

const Title = styled.Text`
  font-size: 17px;
  font-weight: 500;
`;

export const WalletSelector = () => {
  const navigation = useNavigation();
  const appStore = useAppStore();
  const { currentWallet } = appStore;

  function selectWallet() {
    //@ts-ignore
    navigation.navigate("ModalStack", {
      screen: "SelectWallet",
    });
  }

  return (
    <Container onPress={selectWallet}>
      <WalletIcon source={{ uri: currentWallet?.icon }} />
      <Title>
        {currentWallet?.isHyperWallet ? "Hyper Wallet" : "Solana Wallet"}
      </Title>
      <Icon name="ri-arrow-down-s-line" />
    </Container>
  );
};
