import { FC } from "react";
import { ModalStackScreenProps } from "@/navigators";
import styled from "styled-components/native";
import { TokenItem } from "./TokenItem";

const Container = styled.ScrollView`
  padding: 16px 0px;
`;

export const SelectSendTokenScreen: FC<
  ModalStackScreenProps<"SelectSendToken">
> = (props) => {
  const { navigation, route } = props;
  const { tokenBalances } = route.params;
  const sendToken = (tokenBalance) => {
    navigation.navigate("SendToken", {
      tokenBalance,
    });
  };
  return (
    <Container>
      {tokenBalances.map((tokenBalance) => (
        <TokenItem
          key={tokenBalance.mint_address}
          {...tokenBalance}
          onPress={() => sendToken(tokenBalance)}
        />
      ))}
    </Container>
  );
};
