import { FC } from "react";
import styled from "styled-components/native";
import { Space, Button } from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { copyStringToClipboard } from "@/utils";
import { Alert } from "react-native";
import {useAppStore} from "@/stores/appStore";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.foreground.tertiary};
  padding: 8px 16px;
`;

const InputContainer = styled.View`
  background-color: ${({ theme }) => theme.background.secondary};
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  padding: 24px 20px;
  border-radius: 16px;
`;

const Input = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.foreground.primary};
`;

export const PrivateKeyScreen: FC<ModalStackScreenProps<"PrivateKey">> = () => {
    const appStore = useAppStore();
  const insets = useSafeAreaInsets();
  const privateKey = appStore.solanaWallet.privateKey;
  const copy = () => {
    copyStringToClipboard(privateKey).then(() => {
      Alert.alert("Copied Private Key");
    });
  };
  return (
    <Container>
      <Subtitle>
        Never share the private key. Anyone with this key has full access to
        your wallet.
      </Subtitle>
      <InputContainer>
        <Input>{privateKey}</Input>
      </InputContainer>
      <Space />
      <Button label="Copy" variant="secondary" onPress={copy} />
      <Space height={insets.bottom} />
    </Container>
  );
};
