import { TouchableOpacity } from "react-native";
import { Icon, SectionTitle, Space, Subtitle, Title } from "@/components";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useStores } from "@/hooks";
import { SettingItem } from "./SettingItem";

const Container = styled.View`
  padding: 16px;
`;

const Card = styled.View`
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.03);
  flex: 1;
  padding: 16px;
  height: 120px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const SecuritySection = () => {
  const { hyperWalletStore } = useStores();

  return (
    <Container>
      <SectionTitle>Security</SectionTitle>
      <Space height={8} />
      <Row>
        <Card>
          <Title>Device Key</Title>
          <Space height={4} />
          <Subtitle numberOfLines={1} ellipsizeMode="middle">
            {hyperWalletStore.wallet?.deviceApprover.address}
          </Subtitle>
        </Card>
        <Space width={16} />
        <Card>
          <Title>Cloud Key</Title>
          <Space height={4} />
          <Subtitle numberOfLines={1} ellipsizeMode="middle">
            {hyperWalletStore.wallet?.cloudApprover.address}
          </Subtitle>
        </Card>
      </Row>

      <SettingItem iconName="ri-contacts-book-line" title="Whitelist" />
    </Container>
  );
};
