import { Space } from "@/components";
import { CreateWalletScreenProps } from "@/navigators";
import { useAppStore } from "@/stores/appStore";
import { FC } from "react";
import styled from "styled-components/native";

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
  font-size: 21px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

const Subtitle = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.foreground.tertiary};
  margin-top: 4px;
`;

export const SelectImportMethodScreen: FC<
  CreateWalletScreenProps<"SelectImportMethod">
> = ({ navigation }) => {
  const appStore = useAppStore();

  async function loginWithGoogle() {
    return appStore.loginWithGoogle();
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
      </Card>
      <Space height={16} />
      <Card onPress={importPrivateKey}>
        <Title>With Private key</Title>
        <Subtitle>Import a wallet by entering its private key</Subtitle>
      </Card>
      <Space height={16} />
      <Card onPress={importRecoveryPhrase}>
        <Title>With Recovery Phrase</Title>
        <Subtitle>
          Import a wallet with a 12 or 24 word recovery phrase
        </Subtitle>
      </Card>
    </Container>
  );
};
