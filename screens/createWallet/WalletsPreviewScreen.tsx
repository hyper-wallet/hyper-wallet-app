import { Space, Button, Subtitle } from "@/components";
import { CreateWalletScreenProps } from "@/navigators";
import { FC, useEffect, useState } from "react";
import styled from "styled-components/native";
import { SolanaWallet } from "@/lib/SolanaWallet";
import { HyperWallet } from "@/lib/HyperWallet";
import { useStores } from "@/hooks";
import { Image } from "expo-image";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const Card = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 24px;
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

export const WalletsPreviewScreen: FC<
  CreateWalletScreenProps<"WalletsPreview">
> = (props) => {
  const { route } = props;
  const { privateKey } = route.params;
  const [solanaAddress, setSolanaAddress] = useState("");
  const [hyperAddress, setHyperAddress] = useState("");
  const [hyperBusinessAddress, setHyperBusinessAddress] = useState("");
  const [hyperAccountExisted, setHyperAccountExisted] = useState();
  const [hyperBusinessAccountExisted, setHyperBusinessAccountExisted] =
    useState();
  const { appStore } = useStores();

  useEffect(() => {
    fetchWallets();
  }, []);

  async function fetchWallets() {
    const solanaAddress = SolanaWallet.getAddressFromPrivateKey(privateKey);
    setSolanaAddress(solanaAddress);
    const hyperAddress = HyperWallet.deriveAddressFromOwner(solanaAddress);
    setHyperAddress(hyperAddress);
    const hyperBusinessAddress =
      HyperWallet.deriveAddressFromOwner(solanaAddress);
    setHyperBusinessAddress(hyperBusinessAddress);
    HyperWallet.hyperWalletAccountExisted(hyperAddress).then(
      setHyperAccountExisted
    );
    HyperWallet.hyperWalletAccountExisted(hyperAddress).then(
      setHyperBusinessAccountExisted
    );
  }

  function confirmInitWallets() {
    appStore.initWallet(privateKey);
  }

  return (
    <Container>
      <Card>
        <Image
          source={require("@/assets/images/solana-wallet-icon.png")}
          style={{ width: 48, height: 48 }}
        />
        <Space height={8} />
        <Title>Solana Wallet</Title>
        <Space height={2} />
        <Subtitle numberOfLines={1} ellipsizeMode="middle">
          {solanaAddress}
        </Subtitle>
      </Card>
      <Space height={16} />
      <Card>
        <Image
          source={require("@/assets/images/hyper-wallet-icon.png")}
          style={{ width: 48, height: 48 }}
        />
        <Space height={8} />
        <Title>Hyper Wallet</Title>
        <Space height={2} />
        <Subtitle numberOfLines={1} ellipsizeMode="middle">
          {hyperAddress}
        </Subtitle>
      </Card>
      <Space height={16} />
      <Space />
      <Button label="Confirm" onPress={confirmInitWallets} />
      <Space insetBottom />
    </Container>
  );
};
