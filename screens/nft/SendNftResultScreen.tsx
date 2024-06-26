import { useEffect } from "react";
import { Button, Icon, Space } from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import { FC, useState } from "react";
import { styled } from "styled-components/native";
import { middleEllipsis } from "@/utils";
import { palette } from "@/theme/palette";
import { useStores, useTheme } from "@/hooks";
import * as Linking from "expo-linking";
import { apiService } from "@/services";
import { WalletTransactionType } from "@/types";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const IconContainer = styled.View<{ backgroundColor: string }>`
  width: 80px;
  height: 80px;
  border-radius: 999px;
  background-color: ${(p) => p.backgroundColor};
  align-self: center;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
  margin-top: 16px;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.foreground.tertiary};
  margin-top: 4px;
  text-align: center;
`;

export const SendNftResultScreen: FC<ModalStackScreenProps<"SendNftResult">> = (
  props
) => {
  const [sending, setSending] = useState(true);
  const [error, setError] = useState("");
  const [signature, setSignature] = useState("");
  const { appStore, hyperWalletStore, solanaWalletStore } = useStores();
  const theme = useTheme();
  const { currentWallet } = appStore;

  const { navigation, route } = props;
  const { nft, toAddress, feeToken } = route.params;

  const { metadata } = nft;
  const { name, symbol, mint, image_uri } = metadata;

  useEffect(() => {
    send();
  }, []);

  const iconName = sending
    ? "ri-send-plane-line"
    : error
    ? "ri-close-line"
    : "ri-check-line";
  const iconColor = sending
    ? theme.foreground.primary
    : error
    ? palette.red[50]
    : palette.green[50];
  const iconBackgroundColor = sending
    ? theme.background.secondary
    : error
    ? palette.red[10]
    : palette.green[10];
  const title = sending ? "Sending" : error ? "Error" : "Success";
  const subtitle = sending
    ? `Sending ${name} ${symbol.toUpperCase()} to ${middleEllipsis(toAddress)}`
    : error
    ? `${error}`
    : `Sent ${name} ${symbol.toUpperCase()} to ${middleEllipsis(toAddress)}`;

  function close() {
    navigation.getParent()?.goBack();
  }

  function viewOnExplorer() {
    Linking.openURL(
      `https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  }

  async function send() {
    setSending(true);

    const wallet =
      currentWallet == "hyper"
        ? hyperWalletStore.wallet
        : solanaWalletStore.wallet;

    const promise = wallet?.transferNft({
      toAddress,
      nftMintAddress: mint,
      feeToken,
    });

    if (!promise) return;
    promise
      .then((signature) => {
        setSignature(signature);
        apiService
          .createTransaction({
            signature,
            type: WalletTransactionType.TransferNft,
            fromAddress: wallet?.address ?? "",
            toAddress,
            token: { iconUrl: image_uri, name, symbol, amount: 1, price: 0 },
          })
          .then((res) => console.log(res))
          .catch((e) => console.error(e));
      })
      .catch((error) => {
        setError(error);
        apiService
          .createTransaction({
            signature,
            type: WalletTransactionType.TransferNft,
            fromAddress: wallet?.address ?? "",
            toAddress,
            token: { iconUrl: image_uri, name, symbol, amount: 1, price: 0 },
            error: error.message,
          })
          .then((res) => console.log(res))
          .catch((e) => console.error(e));
      })
      .finally(() => setSending(false));
  }

  return (
    <Container>
      <Space />
      <IconContainer backgroundColor={iconBackgroundColor}>
        <Icon name={iconName} size={40} color={iconColor} />
      </IconContainer>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
      {/* For a visually center icon and title */}
      <Space height={100} />
      <Space />
      <Button
        variant="secondary"
        label="View on explorer"
        onPress={viewOnExplorer}
        disabled={!signature}
      />
      <Space height={16} />
      <Button label="Close" onPress={close} disabled={sending} />
      <Space insetBottom />
    </Container>
  );
};
