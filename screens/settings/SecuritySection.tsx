import { TouchableOpacity } from "react-native";
import { Icon, SectionTitle, Space, Subtitle, Title } from "@/components";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useStores } from "@/hooks";

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
  height: 48px;
  padding: 0 16px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: white;
`;

const BadgeContainer = styled.View``;

const BadgeTitle = styled.Text``;

export const SecuritySection = () => {
  const navigation = useNavigation();
  const { hyperWalletStore } = useStores();

  function viewWhitelistSetting() {
    //@ts-ignore
    navigation.navigate("ModalStack", {
      screen: "WhitelistSetting",
    });
  }

  function viewOtpSetting() {
    //@ts-ignore
    navigation.navigate("ModalStack", {
      screen: "OtpSetting",
    });
  }

  const otpStatus = hyperWalletStore.account?.otpEnabled
    ? "Enabled"
    : "Disabled";
  const whitelistStatus = hyperWalletStore.account?.whitelistEnabled
    ? "Enabled"
    : "Disabled";

  return (
    <Container>
      <SectionTitle>Security</SectionTitle>
      <Space height={8} />
      <Card>
        <TouchableOpacity onPress={viewOtpSetting}>
          <Row>
            <Icon name="ri-shield-keyhole-line" size={20} />
            <Space width={4} />
            <Title>OTP</Title>
            {/* <Switch value={otpEnabled} onValueChange={changeOtpSetting} /> */}
            <Space />
            <Subtitle>{otpStatus}</Subtitle>
            <Icon name="ri-arrow-right-s-line" size={20} />
          </Row>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity onPress={viewWhitelistSetting}>
          <Row>
            <Icon name="ri-contacts-book-line" size={20} />
            <Space width={4} />
            <Title>Whitelist</Title>
            <Space />
            <Subtitle>{whitelistStatus}</Subtitle>
            <Icon name="ri-arrow-right-s-line" size={20} />
          </Row>
        </TouchableOpacity>
      </Card>
    </Container>
  );
};
