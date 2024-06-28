import { FC } from "react";
import styled from "styled-components/native";
import { Icon, Title } from "@/components";
import { AppStackScreenProps } from "@/navigators";
import { useStores } from "@/hooks";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const Card = styled.View`
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 4px 0;
`;

const Row = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  justify-content: space-between;
`;

export const NetworkSettingScreen: FC<
  AppStackScreenProps<"NetworkSetting">
> = () => {
  const { settingsStore } = useStores();

  return (
    <Container>
      <Card>
        <Row onPress={() => settingsStore.setNetwork("mainnet")}>
          <Title>Mainnet</Title>
          {settingsStore.network == "mainnet" && <Icon name="ri-check-line" />}
        </Row>
        <Row onPress={() => settingsStore.setNetwork("devnet")}>
          <Title>Devnet</Title>
          {settingsStore.network == "devnet" && <Icon name="ri-check-line" />}
        </Row>
        <Row onPress={() => settingsStore.setNetwork("testnet")}>
          <Title>Testnet</Title>
          {settingsStore.network == "testnet" && <Icon name="ri-check-line" />}
        </Row>
      </Card>
    </Container>
  );
};
