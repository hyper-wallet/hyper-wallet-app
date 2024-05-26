import { FC, useState } from "react";
import { Button, Space, Subtitle, Title } from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import styled from "styled-components/native";
import QRCode from "react-native-qrcode-svg";
import { copyStringToClipboard } from "@/utils";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const QRCodeContainer = styled.View`
  align-items: center;
  margin-top: 8px;
`;

const InputContainer = styled.View`
  background-color: ${({ theme }) => theme.background.secondary};
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 16px;
  margin-top: 8px;
`;

const Input = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.foreground.primary};
`;

export const OtpSecretScreen: FC<ModalStackScreenProps<"OtpSecret">> = (
  props
) => {
  const [copied, setCopied] = useState(false);
  const { route } = props;
  const { secret, otpLink } = route.params;

  function copySecret() {
    copyStringToClipboard(secret).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    });
  }

  return (
    <Container>
      <Title>Method 1: Scan this QR code</Title>
      <Subtitle>
        Scan the following QR code with your authenticator app, such as Google
        Authenticator, Duo Mobile, Authy, etc.
      </Subtitle>
      <QRCodeContainer>
        <QRCode value={otpLink} size={200} />
      </QRCodeContainer>
      <Space height={24} />
      <Title>Method 2: Copy and paste the secret key</Title>
      <Subtitle>
        Paste the key below to your authenticator app, such as Google
        Authenticator, Duo Mobile, Auth, etc.
      </Subtitle>
      <InputContainer>
        <Input>{secret}</Input>
      </InputContainer>
      <Space />
      <Button
        label={copied ? "Copied to clipboard 📋" : "Copy"}
        variant="secondary"
        onPress={copySecret}
      />
      <Space insetBottom />
    </Container>
  );
};
