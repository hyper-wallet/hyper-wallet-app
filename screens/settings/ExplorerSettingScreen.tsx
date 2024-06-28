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

export const ExplorerSettingScreen: FC<
  AppStackScreenProps<"ExplorerSetting">
> = () => {
  const { settingsStore } = useStores();

  return (
    <Container>
      <Card>
        <Row onPress={() => settingsStore.setExplorer("solana")}>
          <Title>Solana Explorer</Title>
          {settingsStore.explorer == "solana" && <Icon name="ri-check-line" />}
        </Row>
        <Row onPress={() => settingsStore.setExplorer("solscan")}>
          <Title>Solscan</Title>
          {settingsStore.explorer == "solscan" && <Icon name="ri-check-line" />}
        </Row>
        <Row onPress={() => settingsStore.setExplorer("solanaFm")}>
          <Title>Solana FM</Title>
          {settingsStore.explorer == "solanaFm" && (
            <Icon name="ri-check-line" />
          )}
        </Row>
      </Card>
    </Container>
  );
};
