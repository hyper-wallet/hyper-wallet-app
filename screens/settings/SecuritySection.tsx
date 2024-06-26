import { Text, TouchableOpacity, View } from "react-native";
import { Icon, SectionTitle, Space, Subtitle, Title } from "@/components";
import styled from "styled-components/native";
import { useStores } from "@/hooks";
import { SettingItem } from "./SettingItem";
import { HyperWallet } from "@/lib/HyperWallet";
import { Approver } from "@/lib/Approver";
import { palette } from "@/theme/palette";

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

const ApproverStatus = (props: {
  hyperWallet: HyperWallet | null;
  approver?: Approver;
}) => {
  const { hyperWallet, approver } = props;
  const valid = hyperWallet?.approvers.includes(approver?.address ?? "");
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          backgroundColor: valid ? palette.green[50] : palette.red[50],
        }}
      />
      <Text
        style={{
          color: valid ? palette.green[50] : palette.red[50],
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {valid ? "Active" : "Invalid"}
      </Text>
    </View>
  );
};

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
          <Space />
          <ApproverStatus
            approver={hyperWalletStore.wallet?.deviceApprover}
            hyperWallet={hyperWalletStore.wallet}
          />
        </Card>
        <Space width={16} />
        <Card>
          <Title>Cloud Key</Title>
          <Space height={4} />
          <Subtitle numberOfLines={1} ellipsizeMode="middle">
            {hyperWalletStore.wallet?.cloudApprover.address}
          </Subtitle>
          <Space />
          <ApproverStatus
            approver={hyperWalletStore.wallet?.cloudApprover}
            hyperWallet={hyperWalletStore.wallet}
          />
        </Card>
      </Row>

      <SettingItem iconName="ri-contacts-book-line" title="Whitelist" />
    </Container>
  );
};
