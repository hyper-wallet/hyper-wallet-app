import { FC } from "react";
import { Button, Space } from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import { styled } from "styled-components/native";
import { Image } from "expo-image";
import { middleEllipsis } from "@/utils";
import { useAppStore } from "@/stores/appStore";
import { HyperWallet } from "@/lib/HyperWallet";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const CoinIcon = styled(Image)`
  width: 80px;
  height: 80px;
  border-radius: 999px;
  align-self: center;
  margin-top: 24px;
  border: 1px solid ${({ theme }) => theme.border.primary};
`;

const Amount = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
  align-self: center;
  margin-top: 8px;
`;

const Value = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.foreground.tertiary};
  align-self: center;
`;

const Card = styled.View`
  border-radius: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.background.secondary};
  margin-top: 32px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.foreground.secondary};
`;

const Subtitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

const Divider = styled.View`
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 16px 0px;
`;

export const SendTokenReviewScreen: FC<
  ModalStackScreenProps<"SendTokenReview">
> = (props) => {
  const { navigation, route } = props;
  const { currentWallet } = useAppStore();
  const { token, toAddress, amount } = route.params;
  const { metadata, price } = token;
  const { symbol, image } = metadata;

  function confirmSend() {
    if (currentWallet instanceof HyperWallet && currentWallet.otpEnabled) {
      navigation.replace("SendTokenOtp", {
        token,
        toAddress,
        amount,
      });
      return;
    }
    navigation.replace("SendTokenResult", {
      token,
      toAddress,
      amount,
    });
  }

  return (
    <Container>
      <CoinIcon source={{ uri: image }} />
      <Amount>
        {amount} {symbol.toUpperCase()}
      </Amount>
      <Value>${(amount * (price.usd as unknown as number)).toFixed(2)}</Value>
      <Card>
        <Row>
          <Title>To</Title>
          <Subtitle>{middleEllipsis(toAddress)}</Subtitle>
        </Row>
        <Divider />
        <Row>
          <Title>Network</Title>
          <Subtitle>Solana Devnet</Subtitle>
        </Row>
        <Divider />
        <Row>
          <Title>Network fee</Title>
          <Subtitle>0.005$</Subtitle>
        </Row>
      </Card>
      <Space />
      <Button label="Confirm" onPress={confirmSend} />
      <Space insetBottom />
    </Container>
  );
};
