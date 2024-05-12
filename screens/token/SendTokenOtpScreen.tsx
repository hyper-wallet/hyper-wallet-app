import { Keyboard, TextInput, TouchableWithoutFeedback } from "react-native";
import { FC, useState } from "react";
import { Button, Space } from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import { styled } from "styled-components/native";
import { Image } from "expo-image";
import { middleEllipsis } from "@/utils";
import { useAppStore } from "@/stores/appStore";

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

const OtpInput = styled.TextInput`
  border: 1px solid black;
  font-size: 24px;
`;

export const SendTokenOtpScreen: FC<ModalStackScreenProps<"SendTokenOtp">> = (
  props
) => {
  const { navigation, route } = props;
  const { walletTokens } = useAppStore();
  const { mint_address, toAddress, amount } = route.params;
  const token = walletTokens.get(mint_address);
  if (!token) {
    return null;
  }

  const { metadata, price } = token;
  const { symbol, image } = metadata;
  const [otp, setOtp] = useState("");

  function confirmSend() {
    navigation.navigate("SendTokenResult", {
      mint_address,
      toAddress,
      amount,
      otp,
    });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Title>Please enter OTP code to confirm transaction</Title>
        <OtpInput onChangeText={setOtp} keyboardType="numeric" />
        <Space />
        <Button label="Confirm" onPress={confirmSend} />
        <Space insetBottom />
      </Container>
    </TouchableWithoutFeedback>
  );
};
