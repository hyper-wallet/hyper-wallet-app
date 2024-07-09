import { FC, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { styled } from "styled-components/native";
import { CreateWalletScreenProps } from "@/navigators";
import { Button, Space } from "@/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "@/stores/appStore";
import { fetchStringFromClipboard } from "@/utils";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";

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

export const ImportRecoveryPhraseScreen: FC<
  CreateWalletScreenProps<"ImportRecoveryPhrase">
> = (props) => {
  const [phrase, setPhrase] = useState<string>("");
  const { navigation } = props;
  const insets = useSafeAreaInsets();

  async function submitImport() {
    const seed = await bip39.mnemonicToSeed(phrase);
    const deriveSeed = derivePath("m/44'/501'/0'/0'", seed.toString("hex")).key;
    const privateKey = bs58.encode(Keypair.fromSeed(deriveSeed).secretKey);
    navigation.navigate("WalletsPreview", { privateKey });
  }

  function paste() {
    fetchStringFromClipboard().then(setPhrase);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Subtitle>
          Enter your recovery phrase below. It's a 12-word phrase.
        </Subtitle>
        <Space height={8} />
        <InputContainer>
          <Input
            value={phrase}
            onChangeText={setPhrase}
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
          label="Import Wallet"
          disabled={!phrase}
          onPress={submitImport}
        />
        <Space height={insets.bottom} />
      </Container>
    </TouchableWithoutFeedback>
  );
};
