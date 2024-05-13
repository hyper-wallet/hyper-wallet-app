import { TouchableOpacity } from "react-native";
import { Icon, SectionTitle, Space, Title } from "@/components";
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

  return (
    <Container>
      <SectionTitle>Security</SectionTitle>
      <Space height={8} />
      <Card>
        <TouchableOpacity onPress={viewOtpSetting}>
          <Row>
            <Title>OTP</Title>
            {/* <Switch value={otpEnabled} onValueChange={changeOtpSetting} /> */}
            <Icon name="ri-arrow-right-s-line" size={20} />
          </Row>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity onPress={viewWhitelistSetting}>
          <Row>
            <Title>Whitelist</Title>
            <Icon name="ri-arrow-right-s-line" size={20} />
          </Row>
        </TouchableOpacity>
      </Card>
    </Container>
  );
};
