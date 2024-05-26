import { Button, Icon, Space, Title } from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import { FC, useRef } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import styled from "styled-components/native";
import { ConfirmTxModal } from "./ConfirmTxModal";
import { useStores } from "@/hooks";
import { palette } from "@/theme/palette";

const Container = styled.View`
  flex: 1;
  padding: 0 16px;
`;

const IconContainer = styled.View`
  background-color: rgba(0, 0, 0, 0.05);
  align-self: center;
  width: 200px;
  height: 200px;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
`;

export const OtpSettingScreen: FC<ModalStackScreenProps<"OtpSetting">> = (
  props
) => {
  const { navigation } = props;
  const { appStore, hyperWalletStore, solanaWalletStore } = useStores();
  const disableOtpModal = useRef<Modalize>(null);
  const enableOtpModal = useRef<Modalize>(null);
  const setupOtpModal = useRef<Modalize>(null);
  const resetOtpModal = useRef<Modalize>(null);

  if (!hyperWalletStore.account) return <View />;

  const { otpEnabled, otpInitTime, otpRoot } = hyperWalletStore.account;
  const otpDidSetup = !!otpInitTime && !!otpRoot;

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
      <Space height={80} />
      <IconContainer>
        <Icon
          name="ri-shield-keyhole-line"
          size={100}
          color={otpEnabled ? palette.green[50] : palette.red[50]}
        />
      </IconContainer>
      <Space height={16} />
      <Title style={{ alignSelf: "center", fontSize: 22 }}>{otpStatus}</Title>
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
      <ConfirmTxModal
        ref={enableOtpModal}
        method="enableOtp"
        onConfirmed={() => {
          hyperWalletStore.setAccount({ otpEnabled: true });
        }}
      />
      <ConfirmTxModal
        ref={disableOtpModal}
        method="disableOtp"
        onConfirmed={() => {
          hyperWalletStore.setAccount({ otpEnabled: false });
        }}
      />
      <ConfirmTxModal ref={setupOtpModal} method="setupOtp" />
      <ConfirmTxModal
        ref={resetOtpModal}
        method="resetOtp"
        onConfirmed={(data) => {
          navigation.navigate("OtpSecret", {
            secret: data.secretKey,
            otpLink: data.otpLink,
          });
        }}
      />
    </Container>
  );
};
