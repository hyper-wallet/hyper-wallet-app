import { Button, Space } from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import { FC, useState } from "react";
import { styled } from "styled-components/native";
import { Image } from "expo-image";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useAppStore } from "@/stores/appStore";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const TokenIcon = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 999px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Input = styled.TextInput`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
  margin: 4px 0px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.foreground.tertiary};
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.background.secondary};
  margin: 16px 0px;
`;

const AmountInput = styled.TextInput`
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
  margin: 4px 0px;
`;

export const SendTokenScreen: FC<ModalStackScreenProps<"SendToken">> = (
  props
) => {
  const [amount, setAmount] = useState("1");
  const [recipientAddress, setRecipientAddress] = useState(
    "Csg6zEgfihsi25RuJkd9M2YjENzLiYya34ZfQmr9fScb"
  );
  const { walletTokens } = useAppStore();

  const { navigation, route } = props;
  const { mint_address } = route.params;
  const token = walletTokens.get(mint_address);
  if (!token) {
    return null;
  }

  const { balance, metadata, price } = token;
  const { name, symbol, image } = metadata;

  function reviewSend() {
    navigation.navigate("SendTokenReview", {
      mint_address,
      toAddress: recipientAddress,
      amount: parseFloat(amount.replace(",", ".")),
    });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <TokenIcon source={{ uri: image }} />
        <Space height={4} />
        <Subtitle>Sending:</Subtitle>
        <Title>{name}</Title>
        <Space height={16} />
        <Subtitle>Send to:</Subtitle>
        <Input
          placeholder="Enter Recipient address"
          value={recipientAddress}
          onChangeText={setRecipientAddress}
        />
        <Space height={16} />
        <Subtitle>Amount:</Subtitle>
        <AmountInput
          placeholder="0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <Divider />
        <Row>
          <Subtitle>Available</Subtitle>
          <Title>
            {balance.toFixed(2)} {symbol.toUpperCase()}
          </Title>
        </Row>
        <Space height={4} />
        <Row>
          <Subtitle>Network fee</Subtitle>
          <Title>0.000005 SOL</Title>
        </Row>
        <Space />
        <Button label="Review" onPress={reviewSend} />
        <Space insetBottom />
      </Container>
    </TouchableWithoutFeedback>
  );
};
