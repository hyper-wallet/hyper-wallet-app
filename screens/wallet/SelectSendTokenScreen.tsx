import { FC } from "react";
import { ModalStackScreenProps } from "@/navigators";
import styled from "styled-components/native";
import { TokenItem } from "./TokenItem";
import { useStores } from "@/hooks";
import { WalletToken } from "@/types";

const Container = styled.ScrollView`
  padding: 16px 0px;
`;

export const SelectSendTokenScreen: FC<
  ModalStackScreenProps<"SelectSendToken">
> = (props) => {
  const { navigation } = props;
  const { appStore, hyperWalletStore, solanaWalletStore } = useStores();

  const tokens =
    appStore.currentWallet == "hyper"
      ? Array.from(hyperWalletStore.tokens.values())
      : Array.from(solanaWalletStore.tokens.values());

  function sendToken(token: WalletToken) {
    navigation.navigate("SendToken", {
      token,
    });
  }

  return (
    <Container>
      {tokens.map((token) => (
        <TokenItem
          key={token.metadata.mint_address}
          {...token}
          onPress={() => sendToken(token)}
        />
      ))}
    </Container>
  );
};
