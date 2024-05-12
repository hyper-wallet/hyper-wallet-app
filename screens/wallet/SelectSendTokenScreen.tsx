import { FC } from "react";
import { ModalStackScreenProps } from "@/navigators";
import styled from "styled-components/native";
import { TokenItem } from "./TokenItem";
import { useAppStore } from "@/stores/appStore";

const Container = styled.ScrollView`
  padding: 16px 0px;
`;

export const SelectSendTokenScreen: FC<
  ModalStackScreenProps<"SelectSendToken">
> = (props) => {
  const { navigation, route } = props;
  const { walletTokens } = useAppStore();
  const tokens = Array.from(walletTokens.values());
  const sendToken = (mint_address: string) => {
    navigation.navigate("SendToken", {
      mint_address,
    });
  };
  return (
    <Container>
      {tokens.map((token) => (
        <TokenItem
          key={token.metadata.mint_address}
          {...token}
          onPress={() => sendToken(token.metadata.mint_address)}
        />
      ))}
    </Container>
  );
};
