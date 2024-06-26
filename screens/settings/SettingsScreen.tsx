import { FC } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { RootTabScreenProps } from "@/navigators";
import { SettingItem } from "./SettingItem";
import { Divider, Space, Icon, Title } from "@/components";
import { useStores, useTheme } from "@/hooks";
import { useAppStore } from "@/stores/appStore";
import { SecuritySection } from "./SecuritySection";
import { BackupSection } from "./BackupSection";
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

export const SettingsScreen: FC<RootTabScreenProps<"Settings">> = () => {
  const theme = useTheme();
  const { removeWallet } = useAppStore();
  const { hyperWalletStore } = useStores();

  function closeWallet() {
    hyperWalletStore.wallet?.closeHyperWalletAccount().then(removeWallet);
  }

  return (
    <Container>
      <SecuritySection />
      <Card>
        <TouchableOpacity onPress={removeWallet}>
          <Row>
            <Icon
              name="ri-delete-bin-7-line"
              size={20}
              color={palette.red[50]}
            />
            <Space width={4} />
            <Title style={{ color: palette.red[50] }}>Remove wallet</Title>
            <Space />
          </Row>
        </TouchableOpacity>
      </Card>

      <Card>
        <TouchableOpacity onPress={closeWallet}>
          <Row>
            <Icon
              name="ri-delete-bin-7-line"
              size={20}
              color={palette.red[50]}
            />
            <Space width={4} />
            <Title style={{ color: palette.red[50] }}>Close wallet</Title>
            <Space />
          </Row>
        </TouchableOpacity>
      </Card>
    </Container>
  );
};
