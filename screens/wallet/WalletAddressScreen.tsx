import { FC, useState } from "react";
import { Button, Space } from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import styled from "styled-components/native";
import QRCode from "react-native-qrcode-svg";
import { copyStringToClipboard } from "@/utils";
import { useStores } from "@/hooks";
import HyperWalletIcon from "@/assets/images/hyper-wallet-icon.png";
import SolanaWalletIcon from "@/assets/images/solana-wallet-icon.png";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.foreground.tertiary};
  text-align: center;
  margin: 8px;
`;

const QRCodeContainer = styled.View`
  align-items: center;
  margin-top: 48px;
`;

const InputContainer = styled.View`
  background-color: ${({ theme }) => theme.background.secondary};
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  padding: 16px;
  border-radius: 16px;
`;

const Input = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.foreground.primary};
`;

export const WalletAddressScreen: FC<
  ModalStackScreenProps<"WalletAddress">
> = () => {
  const [copied, setCopied] = useState(false);
  const { appStore, hyperWalletStore, solanaWalletStore } = useStores();
  const { currentWallet } = appStore;
  const address =
    currentWallet == "solana"
      ? solanaWalletStore.wallet?.address
      : hyperWalletStore.wallet?.address;

  function copyAddress() {
    copyStringToClipboard(address).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    });
  }

  return (
    <Container>
      <QRCodeContainer>
        <QRCode
          value={address}
          size={300}
          logo={currentWallet == "hyper" ? HyperWalletIcon : SolanaWalletIcon}
        />
      </QRCodeContainer>
      <InputContainer>
        <Input>{address}</Input>
      </InputContainer>
      <Subtitle>
        {`This is your ${
          currentWallet == "hyper" ? "Hyper Wallet" : "Solana Walelt"
        } address. Please only use this address to reciver assets on Solana network address `}
      </Subtitle>
      <Space />
      <Button
        label={copied ? "Copied to clipboard 📋" : "Copy"}
        variant="secondary"
        onPress={copyAddress}
      />
      <Space insetBottom />
    </Container>
  );
};
