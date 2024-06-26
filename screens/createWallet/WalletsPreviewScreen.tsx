import { Space, Button, Subtitle } from "@/components";
import { CreateWalletScreenProps } from "@/navigators";
import { FC, useEffect, useState } from "react";
import styled from "styled-components/native";
import { Image } from "expo-image";
import { SolanaWallet } from "@/lib/SolanaWallet";
import { HyperWallet } from "@/lib/HyperWallet";
import { useStores } from "@/hooks";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const Card = styled.TouchableOpacity`
  height: 200px;
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
        <Title>Solana wwallet</Title>
        <Subtitle numberOfLines={1} ellipsizeMode="middle">
          {solanaAddress}
        </Subtitle>
        <Image
          source={require("@/assets/images/sign-in-with-google.png")}
          style={{
            width: 320,
            height: 120,
            position: "absolute",
            bottom: 0,
            alignSelf: "center",
          }}
        />
      </Card>
      <Space height={16} />
      <Card>
        <Title>Hyper Wallet</Title>
        <Subtitle numberOfLines={1} ellipsizeMode="middle">
          {hyperAddress}
        </Subtitle>
        <Space />
        {hyperAccountExisted == true ? (
          <Subtitle>Existed</Subtitle>
        ) : hyperAccountExisted == false ? (
          <Button variant="secondary" label="Create" />
        ) : (
          <Subtitle>Loading</Subtitle>
        )}
      </Card>
      <Space height={16} />
      {/* <Card>
        <Title>Hyper Business Wallet</Title>
        <Subtitle numberOfLines={1} ellipsizeMode="middle">
          {hyperBusinessAddress}
        </Subtitle>
        <Space />
        {hyperBusinessAccountExisted == true ? (
          <Subtitle>Existed</Subtitle>
        ) : hyperBusinessAccountExisted == false ? (
          <Button label="Create" />
        ) : (
          <Subtitle>Loading</Subtitle>
        )}
      </Card>
      <Space /> */}
      <Space />
      <Button label="Confirm" onPress={confirmInitWallets} />
      <Space insetBottom />
    </Container>
  );
};
