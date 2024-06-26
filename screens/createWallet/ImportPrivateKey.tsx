import { FC, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { styled } from "styled-components/native";
import { CreateWalletScreenProps } from "@/navigators";
import { Button, Space } from "@/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "@/stores/appStore";
import { fetchStringFromClipboard } from "@/utils";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.foreground.tertiary};
  text-align: center;
  line-height: 20px;
`;

const InputContainer = styled.View`
  background-color: ${({ theme }) => theme.background.secondary};
  align-items: center;
  justify-content: center;
  padding: 12px 16px 16px 16px;
  height: 110px;
  border-radius: 16px;
`;

const Input = styled.TextInput`
  font-size: 20px;
  color: ${({ theme }) => theme.foreground.primary};
`;

const PillButton = styled.TouchableOpacity`
  height: 36px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.background.secondary};
  align-self: center;
  align-items: center;
  justify-content: center;
  padding: 0px 16px;
  margin-top: 8px;
`;

const PillButtonLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

export const ImportPrivateKeyScreen: FC<
  CreateWalletScreenProps<"ImportPrivateKey">
> = () => {
  const [privateKey, setPrivateKey] = useState<string>("");
  const [importing, setImporting] = useState(false);
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const appStore = useAppStore();

  function submitImport() {
    // setImporting(true);
    // appStore.importPrivateKey(privateKey).finally(() => setImporting(false));
    navigation.navigate("WalletsPreview", { privateKey });
  }

  function paste() {
    fetchStringFromClipboard().then(setPrivateKey);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Subtitle>
          Enter your private key below. It is a series of random letters or a
          list of numbers.
        </Subtitle>
        <Space height={8} />
        <InputContainer>
          <Input
            value={privateKey}
            onChangeText={setPrivateKey}
            placeholder="Paste here or type..."
            multiline
            placeholderTextColor="rgba(0,0,0,0.3)"
          />
        </InputContainer>
        <PillButton onPress={paste}>
          <PillButtonLabel>Paste</PillButtonLabel>
        </PillButton>
        <Space />
        <Button
          label={importing ? "Importing Wallet" : "Import Wallet"}
          disabled={!privateKey || importing}
          onPress={submitImport}
        />
        <Space height={insets.bottom} />
      </Container>
    </TouchableWithoutFeedback>
  );
};
