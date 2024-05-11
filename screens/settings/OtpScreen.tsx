import { Button, Space, Title } from "@/components";
import { HyperWallet } from "@/lib/HyperWallet";
import { ModalStackScreenProps } from "@/navigators";
import { useAppStore } from "@/stores/appStore";
import { FC, useRef } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import styled from "styled-components/native";
import { ConfirmTxModal } from "./ConfirmTxModal";

const Container = styled.View`
  flex: 1;
  padding: 0 16px;
`;

export const OtpScreen: FC<ModalStackScreenProps<"Otp">> = () => {
  const { currentWallet } = useAppStore();
  const confirmTxModal = useRef<Modalize>(null);
  if (!(currentWallet instanceof HyperWallet)) {
    return <View />;
  }

  const { otpEnabled, otpDidSetup } = currentWallet;

  function setupOtp() {
    confirmTxModal.current?.open();
  }

  function enableOtp() {
    confirmTxModal.current?.open();
  }

  function disableOtp() {
    confirmTxModal.current?.open();
  }

  const otpStatus = otpDidSetup
    ? otpEnabled
      ? "OTP is enabled"
      : "OTP is disabled"
    : "OTP is not setup";

  return (
    <Container>
      <Title>{otpStatus}</Title>
      <Space />
      {otpDidSetup ? (
        otpEnabled ? (
          <Button label="Disable" onPress={disableOtp} />
        ) : (
          <Button label="Enable" onPress={enableOtp} />
        )
      ) : (
        <Button label="Setup" onPress={setupOtp} />
      )}
      <Space insetBottom />
    </Container>
  );
};
