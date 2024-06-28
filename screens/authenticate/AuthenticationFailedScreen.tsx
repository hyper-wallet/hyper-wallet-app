import { Title } from "@/components";
import { Button, Text } from "react-native";
import { styled } from "styled-components/native";

const Container = styled.View`
  flex: 1;
  padding: 16px;
  align-items: center;
  justify-content: center;
`;

export const AuthenticationFailedScreen = (props: any) => {
  const { reauthenticate } = props;
  return (
    <Container>
      <Text
        style={{
          textAlign: "center",
          fontSize: 24,
        }}
      >
        Authentication Failed
      </Text>
      <Button onPress={reauthenticate} title="Try again" />
    </Container>
  );
};
