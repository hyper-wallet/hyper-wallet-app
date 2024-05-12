import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import {
  Space,
  Button,
  SectionTitle,
  Title,
  EmptyState,
  ModalSheet,
  Icon,
  Subtitle,
} from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import { useAppStore } from "@/stores/appStore";
import { HyperWallet } from "@/lib/HyperWallet";
import { Alert, Switch, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { ConfirmTxModal } from "./ConfirmTxModal";
import { palette } from "@/theme/palette";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const Card = styled.View`
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 4px 0px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const PillButton = styled.TouchableOpacity`
  background-color: rgba(0, 0, 0, 0.1);
  padding: 4px 12px;
  border-radius: 100%;
`;

const PillButtonLabel = styled.Text``;

export const WhitelistSettingScreen: FC<
  ModalStackScreenProps<"WhitelistSetting">
> = () => {
  const appStore = useAppStore();
  const enableWhitelistModal = useRef<Modalize>(null);
  const disableWhitelistModal = useRef<Modalize>(null);
  const removeAddressModal = useRef<Modalize>(null);
  const { currentWallet } = appStore;

  if (!(currentWallet instanceof HyperWallet)) {
    return (
      <View>
        <Space height={16} />
        <EmptyState label="This features is not supported for Solana wallet" />
      </View>
    );
  }

  const enabled = currentWallet.whitelistEnabled;
  const addresses = currentWallet.whitelistedAddresses;

  function enable() {
    enableWhitelistModal.current?.open();
  }
  function disable() {
    enableWhitelistModal.current?.open();
  }
  function addAddress() {
    Alert.prompt(
      "Enter address",
      "Enter address to be added to whitelist",
      (value) => {
        (currentWallet as HyperWallet).addAddressToWhitelist(value);
      }
    );
  }
  function removeAddress(address: string) {
    (currentWallet as HyperWallet).removeAddressFromWhitelist(address);
  }

  return (
    <Container>
      <SectionTitle>Whitelisted addresses</SectionTitle>
      <Space height={8} />
      {addresses.length > 0 && (
        <Card>
          {addresses.map((address) => (
            <Row>
              <Subtitle
                numberOfLines={1}
                ellipsizeMode="middle"
                style={{ flex: 1 }}
              >
                {address}
              </Subtitle>
              <Space width={8} />
              <TouchableOpacity onPress={() => removeAddress(address)}>
                <Icon name="ri-delete-bin-line" color={palette.red[50]} />
              </TouchableOpacity>
            </Row>
          ))}
        </Card>
      )}
      <Space />
      <Button variant="secondary" label="Add address" onPress={addAddress} />
      <Space height={16} />
      {enabled ? (
        <Button label="Disable" onPress={disable} />
      ) : (
        <Button label="Enable" onPress={enable} />
      )}
      <Space insetBottom />
      <ConfirmTxModal ref={enableWhitelistModal} method="enableWhitelist" />
      <ConfirmTxModal ref={disableWhitelistModal} method="disableWhitelist" />
    </Container>
  );
};
