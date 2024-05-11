import { useRef, useState } from "react";
import { Switch, TouchableOpacity, View } from "react-native";
import { Icon, SectionTitle, Space, Title } from "@/components";
import { HyperWallet } from "@/lib/HyperWallet";
import { useAppStore } from "@/stores/appStore";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Modalize } from "react-native-modalize";
import { ConfirmTxModal } from "./ConfirmTxModal";

const Container = styled.View`
  padding: 16px;
`;

// add 4px padding to the top and bottom of the card for better visual effect
const Card = styled.View`
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 4px 0;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: white;
`;

export const SecuritySection = () => {
  const navigation = useNavigation();
  const appStore = useAppStore();
  const confirmEnableOtpTxModal = useRef<Modalize>();
  const confirmDisableOtpTxModal = useRef<Modalize>();
  const confirmEnableWhitelistTxModal = useRef<Modalize>();
  const confirmDisableWhitelistTxModal = useRef<Modalize>();
  const { currentWallet } = appStore;
  const [otpEnabled, setOtpEnabled] = useState(
    currentWallet instanceof HyperWallet ? currentWallet.otpEnabled : false
  );
  const [whitelistEnabled, setWhitelistEnabled] = useState(
    currentWallet instanceof HyperWallet
      ? currentWallet.whitelistEnabled
      : false
  );

  if (!(currentWallet instanceof HyperWallet)) {
    return <View />;
  }

  function changeOtpSetting(enabled) {
    if (enabled) {
      confirmEnableOtpTxModal.current?.open();
    } else {
      confirmDisableOtpTxModal.current?.open();
    }
  }

  function changeWhitelistSetting(enabled) {
    if (enabled) {
      confirmEnableWhitelistTxModal.current?.open();
    } else {
      confirmDisableWhitelistTxModal.current?.open();
    }
  }

  function viewWhitelistSetting() {
    //@ts-ignore
    navigation.navigate("ModalStack", {
      screen: "Whitelist",
    });
  }

  return (
    <Container>
      <SectionTitle>Security</SectionTitle>
      <Space height={8} />
      <Card>
        <Row>
          <Title>OTP</Title>
          <Switch value={otpEnabled} onValueChange={changeOtpSetting} />
        </Row>
        <Divider />
        <Row>
          <Title>Whitelist</Title>
          <Switch
            value={whitelistEnabled}
            onValueChange={changeWhitelistSetting}
          />
        </Row>
        <Divider />
        <TouchableOpacity onPress={viewWhitelistSetting}>
          <Row>
            <Title>Whitelisted Addresses</Title>
            <Icon name="ri-arrow-right-s-line" size={20} />
          </Row>
        </TouchableOpacity>
      </Card>
      <ConfirmTxModal
        ref={confirmEnableOtpTxModal}
        method="enableOtp"
        onConfirmed={() => setOtpEnabled(true)}
        onRejected={() => setOtpEnabled(false)}
      />
      <ConfirmTxModal
        ref={confirmDisableOtpTxModal}
        method="disableOtp"
        onConfirmed={() => setOtpEnabled(false)}
        onRejected={() => setOtpEnabled(true)}
      />
      <ConfirmTxModal
        ref={confirmEnableWhitelistTxModal}
        method="enableWhitelist"
        onConfirmed={() => setWhitelistEnabled(true)}
        onRejected={() => setWhitelistEnabled(false)}
      />
      <ConfirmTxModal
        ref={confirmDisableWhitelistTxModal}
        method="disableWhitelist"
        onConfirmed={() => setWhitelistEnabled(false)}
        onRejected={() => setWhitelistEnabled(true)}
      />
    </Container>
  );
};
