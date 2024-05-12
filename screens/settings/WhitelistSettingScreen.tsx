import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import {
  Space,
  Button,
  SectionTitle,
  Title,
  EmptyState,
  ModalSheet,
} from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import { useAppStore } from "@/stores/appStore";
import { HyperWallet } from "@/lib/HyperWallet";
import { Switch, View } from "react-native";
import { Modalize } from "react-native-modalize";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const Card = styled.View`
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 8px 16px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  const confirmTxModal = useRef<Modalize>(null);
  const addAddressModal = useRef<Modalize>(null);
  const { currentWallet } = appStore;
  const [enabled, setEnabled] = useState(
    currentWallet instanceof HyperWallet
      ? currentWallet?.whitelistEnabled
      : false
  );

  useEffect(() => {
    if (enabled) {
      //
    }
  }, [enabled]);

  const addresses =
    currentWallet instanceof HyperWallet
      ? currentWallet?.whitelistedAddresses
      : [];
  if (!currentWallet?.isHyperWallet) {
    return (
      <View>
        <Space height={16} />
        <EmptyState label="This features is not supported for Solana wallet" />
      </View>
    );
  }

  return (
    <Container>
      <Card>
        <Row>
          <Title>Enabled</Title>
          <Switch value={enabled} />
        </Row>
      </Card>
      <Space height={16} />
      <Row>
        <SectionTitle>Whitelisted addresses</SectionTitle>
        <PillButton>
          <PillButtonLabel>Add</PillButtonLabel>
        </PillButton>
      </Row>
      <Space height={8} />
      <Card>
        {addresses.map((address) => (
          <Row>
            <Title>{address}</Title>
          </Row>
        ))}
      </Card>
      <ModalSheet ref={confirmTxModal}></ModalSheet>
    </Container>
  );
};
