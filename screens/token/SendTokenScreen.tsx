import { Button, PasteButton, Space } from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import { FC, useState } from "react";
import { styled } from "styled-components/native";
import { Image } from "expo-image";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useAppStore } from "@/stores/appStore";
import { fetchStringFromClipboard } from "@/utils";

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
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

const PillButton = styled.TouchableOpacity`
  height: 32px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.background.secondary};
  align-self: center;
  align-items: center;
  justify-content: center;
  padding: 0px 16px;
`;

const PillButtonLabel = styled.Text`
  font-size: 14px;
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
  const [amount, setAmount] = useState("5");
  const [recipientAddress, setRecipientAddress] = useState(
    "4ywgeyfbiYcAAqJTNtSY4DuCwQjnz9cctPR2S9twutbT"
  );
  const { walletTokens } = useAppStore();

  const { navigation, route } = props;
  const { token } = route.params;

  const { balance, metadata, price } = token;
  const { name, symbol, image, mint_address } = metadata;

  function paste() {
    fetchStringFromClipboard().then(setRecipientAddress);
  }

  function reviewSend() {
    navigation.navigate("SendTokenReview", {
      token,
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
        <Row>
          <Input
            placeholder="Enter Recipient address"
            value={recipientAddress}
            onChangeText={setRecipientAddress}
            clearButtonMode="while-editing"
            placeholderTextColor="rgba(0,0,0,0.3)"
          />
          <PillButton onPress={paste}>
            <PillButtonLabel>Paste</PillButtonLabel>
          </PillButton>
        </Row>
        <Space height={16} />
        <Subtitle>Amount:</Subtitle>
        <AmountInput
          placeholder="0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="rgba(0,0,0,0.3)"
        />
        <Divider />
        <Row>
          <Subtitle>Available</Subtitle>
          <Title>
            {balance.toFixed(2)} {symbol.toUpperCase()}
          </Title>
        </Row>
        <Space height={4} />
        {/* <Row>
          <Subtitle>Network fee</Subtitle>
          <Title>0.000005 SOL</Title>
        </Row> */}
        <Space />
        <Button
          label="Review"
          onPress={reviewSend}
          disabled={!recipientAddress || !amount}
        />
        <Space insetBottom />
      </Container>
    </TouchableWithoutFeedback>
  );
};
