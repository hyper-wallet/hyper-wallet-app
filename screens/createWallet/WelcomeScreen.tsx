import { FC } from "react";
import { styled } from "styled-components/native";
import { CreateWalletScreenProps } from "@/navigators";
import { Button, Space } from "@/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Container = styled.View`
  flex: 1;
  padding: 16px;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 48px;
  font-weight: 800;
  line-height: 48px;
  color: ${({ theme }) => theme.foreground.primary};
`;

const Subtitle = styled.Text`
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.tertiary};
  margin-top: 8px;
`;

const Description = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.foreground.tertiary};
  margin-top: 8px;
`;

export const WelcomeScreen: FC<CreateWalletScreenProps<"Welcome">> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const selectImportMethod = () => {
    navigation.navigate("SelectImportMethod");
  };

  const selectGenerateMethod = () => {
    navigation.navigate("SelectGenerateMethod");
  };

  return (
    <Container>
      <Space height={insets.top} />
      <Title>Welcome to Hyper Wallet</Title>
      <Subtitle>Your favorite Smart Contract wallet on Solana.</Subtitle>
      <Space />
      <Description>Choose how you'd like to set up your wallet</Description>
      <Space height={16} />
      <Button
        variant="secondary"
        label="I already had a wallet"
        onPress={selectImportMethod}
      />
      <Space height={16} />
      <Button label={"Create a new wallet"} onPress={selectGenerateMethod} />
      <Space height={insets.bottom} />
    </Container>
  );
};
