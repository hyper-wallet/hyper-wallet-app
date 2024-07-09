import { Space } from "@/components";
import { CreateWalletScreenProps } from "@/navigators";
import { useAppStore } from "@/stores/appStore";
import { FC } from "react";
import styled from "styled-components/native";
import { Image } from "expo-image";
import { socialAuthService } from "@/services";

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

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.foreground.tertiary};
  margin-top: 4px;
`;

export const SelectImportMethodScreen: FC<
  CreateWalletScreenProps<"SelectImportMethod">
> = ({ navigation }) => {
  const appStore = useAppStore();

  async function loginWithGoogle() {
    await socialAuthService.loginWithGoogle();
    const privateKey = socialAuthService.getPrivateKey();
    navigation.navigate("WalletsPreview", {
      privateKey,
    });
  }

  function importPrivateKey() {
    navigation.navigate("ImportPrivateKey");
  }

  function importRecoveryPhrase() {
    navigation.navigate("ImportRecoveryPhrase");
  }

  return (
    <Container>
      <Card onPress={loginWithGoogle}>
        <Title>With Google account</Title>
        <Subtitle>Sign in with Google to recover your wallet</Subtitle>
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
      <Card onPress={importPrivateKey}>
        <Title>With Private Key</Title>
        <Subtitle>Import a wallet by entering its private key</Subtitle>
        <Image
          source={require("@/assets/images/import-private-key.png")}
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
      <Card onPress={importRecoveryPhrase}>
        <Title>With Recovery Phrase</Title>
        <Subtitle>
          Import a wallet with a 12 or 24 word recovery phrase
        </Subtitle>
        <Image
          source={require("@/assets/images/import-mnemonic.png")}
          style={{
            width: 320,
            height: 100,
            position: "absolute",
            bottom: 0,
            alignSelf: "center",
          }}
        />
      </Card>
    </Container>
  );
};
