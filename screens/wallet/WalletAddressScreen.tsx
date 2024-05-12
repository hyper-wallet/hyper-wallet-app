import { FC } from "react";
import { Button, Space } from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { QRCode } from "react-native-custom-qr-codes-expo";
import { copyStringToClipboard } from "@/utils";
import { Alert } from "react-native";
import { useAppStore } from "@/stores/appStore";

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
  const appStore = useAppStore();
  const { currentWallet } = appStore;
  const insets = useSafeAreaInsets();
  const copyAddress = () => {
    copyStringToClipboard(currentWallet?.address).then(() => {
      Alert.alert("Copied address");
    });
  };
  return (
    <Container>
      <QRCodeContainer>
        <QRCode content={currentWallet?.address} />
      </QRCodeContainer>
      <InputContainer>
        <Input>{currentWallet?.address}</Input>
      </InputContainer>
      <Subtitle>
        This is a Solana wallet. Please only send assets on the Solana
        blockchain.
      </Subtitle>
      <Space />
      <Button label="Copy" variant="secondary" onPress={copyAddress} />
      <Space height={insets.bottom} />
    </Container>
  );
};
