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

export const OtpSettingScreen: FC<ModalStackScreenProps<"OtpSetting">> = () => {
  const { currentWallet } = useAppStore();
  const disableOtpModal = useRef<Modalize>(null);
  const enableOtpModal = useRef<Modalize>(null);
  const setupOtpModal = useRef<Modalize>(null);
  const resetOtpModal = useRef<Modalize>(null);

  if (!(currentWallet instanceof HyperWallet)) {
    return <View />;
  }

  const { otpEnabled, otpDidSetup } = currentWallet;

  function setupOtp() {
    setupOtpModal.current?.open();
  }

  function enableOtp() {
    enableOtpModal.current?.open();
  }

  function disableOtp() {
    disableOtpModal.current?.open();
  }

  function resetOtp() {
    resetOtpModal.current?.open();
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
          <>
            <Button variant="secondary" label="Reset" onPress={resetOtp} />
            <Space height={16} />
            <Button label="Disable" onPress={disableOtp} />
          </>
        ) : (
          <>
            <Button variant="secondary" label="Reset" onPress={resetOtp} />
            <Space height={16} />
            <Button label="Enable" onPress={enableOtp} />
          </>
        )
      ) : (
        <Button label="Setup" onPress={setupOtp} />
      )}
      <Space height={16} />
      <Space insetBottom />
      <ConfirmTxModal ref={enableOtpModal} method="enableOtp" />
      <ConfirmTxModal ref={disableOtpModal} method="disableOtp" />
      <ConfirmTxModal ref={setupOtpModal} method="setupOtp" />
      <ConfirmTxModal ref={resetOtpModal} method="resetOtp" />
    </Container>
  );
};
