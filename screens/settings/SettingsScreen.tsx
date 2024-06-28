import { FC } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { RootTabScreenProps } from "@/navigators";
import { Divider, Space, Icon, Title, SectionTitle } from "@/components";
import { useStores, useTheme } from "@/hooks";
import { useAppStore } from "@/stores/appStore";
import { SecuritySection } from "./SecuritySection";
import styled from "styled-components/native";
import { palette } from "@/theme/palette";

const Container = styled.View`
  flex: 1;
`;

const Card = styled.View`
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 4px 0;
  margin: 0px 16px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  height: 48px;
  padding: 0 16px;
`;

export const SettingsScreen: FC<RootTabScreenProps<"Settings">> = (props) => {
  const theme = useTheme();
  const { navigation } = props;
  const { removeWallet } = useAppStore();
  const { hyperWalletStore } = useStores();

  function closeWallet() {
    hyperWalletStore.wallet?.closeHyperWalletAccount().then(removeWallet);
  }

  function openWhitelistSetting() {
    navigation.navigate("WhitelistSetting");
  }

  function openExplorerSetting() {
    navigation.navigate("ExplorerSetting");
  }

  function openNetworkSetting() {
    // @ts-ignore
    navigation.navigate("NetworkSetting");
  }

  return (
    <Container>
      <SecuritySection />

      <SectionTitle style={{ marginHorizontal: 16, marginBottom: 8 }}>
        Settings
      </SectionTitle>
      <Card>
        <TouchableOpacity onPress={openWhitelistSetting}>
          <Row>
            <Icon name="ri-file-list-line" size={20} />
            <Space width={4} />
            <Title>Whitelist</Title>
            <Space />
          </Row>
        </TouchableOpacity>
        <TouchableOpacity onPress={openExplorerSetting}>
          <Row>
            <Icon name="ri-search-line" size={20} />
            <Space width={4} />
            <Title>Explorer</Title>
            <Space />
          </Row>
        </TouchableOpacity>
        <TouchableOpacity onPress={openNetworkSetting}>
          <Row>
            <Icon name="ri-global-line" size={20} />
            <Space width={4} />
            <Title>Network</Title>
            <Space />
          </Row>
        </TouchableOpacity>
      </Card>
      <Space height={16} />

      <SectionTitle style={{ marginHorizontal: 16, marginBottom: 8 }}>
        Danger
      </SectionTitle>
      <Card>
        <TouchableOpacity onPress={removeWallet}>
          <Row>
            <Icon
              name="ri-delete-bin-7-line"
              size={20}
              color={palette.red[50]}
            />
            <Space width={4} />
            <Title style={{ color: palette.red[50] }}>
              Remove wallet from app
            </Title>
            <Space />
          </Row>
        </TouchableOpacity>
        <TouchableOpacity onPress={closeWallet}>
          <Row>
            <Icon name="ri-shut-down-line" size={20} color={palette.red[50]} />
            <Space width={4} />
            <Title style={{ color: palette.red[50] }}>Close wallet</Title>
            <Space />
          </Row>
        </TouchableOpacity>
      </Card>
    </Container>
  );
};
