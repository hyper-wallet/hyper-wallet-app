import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { FC, useState } from "react";
import { Button, Space } from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import { styled } from "styled-components/native";
import { fetchStringFromClipboard } from "@/utils";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.foreground.secondary};
  text-align: center;
  align-self: center;
`;

const OtpInput = styled.TextInput`
  border: 1px solid rgba(0, 0, 0, 0.2);
  font-size: 48px;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  width: 200px;
  align-self: center;
`;

const PillButton = styled.TouchableOpacity`
  height: 36px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.background.secondary};
  align-self: center;
  align-items: center;
  justify-content: center;
  padding: 0px 16px;
  margin-top: 16px;
`;

const PillButtonLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

export const SendNftOtpScreen: FC<ModalStackScreenProps<"SendNftOtp">> = (
  props
) => {
  const { navigation, route } = props;
  const { nft, toAddress, feeToken } = route.params;

  const [otp, setOtp] = useState("");

  function paste() {
    fetchStringFromClipboard().then(setOtp);
  }

  function confirmSend() {
    navigation.navigate("SendNftResult", {
      nft,
      toAddress,
      otp,
      feeToken,
    });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Space />
        <Title>Please enter OTP code to confirm transaction</Title>
        <Space height={16} />
        <OtpInput value={otp} onChangeText={setOtp} keyboardType="numeric" />
        <PillButton onPress={paste}>
          <PillButtonLabel>Paste</PillButtonLabel>
        </PillButton>
        <Space height={200} />
        <Space />
        <Button label="Confirm" onPress={confirmSend} />
        <Space insetBottom />
      </Container>
    </TouchableWithoutFeedback>
  );
};
