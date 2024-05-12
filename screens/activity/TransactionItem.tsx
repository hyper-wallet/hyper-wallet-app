import { FC } from "react";
import { WalletTransaction } from "@/types";
import { styled } from "styled-components/native";
import { Icon, Subtitle } from "@/components";
import { middleEllipsis } from "@/utils";
import * as Linking from "expo-linking";

type TransactionItemProps = WalletTransaction & {};

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
`;

const Column = styled.View`
  flex: 1;
  flex-direction: column;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.foreground.primary};
`;

const IconContainer = styled.View`
  height: 48px;
  width: 48px;
  background-color: rgba(0, 0, 0, 0.1);
  align-items: center;
  justify-content: center;
  border-radius: 100%;
`;

const TransactionTitle = (props) => {
  const { transaction } = props;
  const { name } = transaction;
  const titleByName = {
    setUpOtp: "Setup OTP",
    enableOtp: "Enable OTP",
    disableOtp: "Disable OTP",
    transferSpl: "Send token",
  };
  const title = name in titleByName ? titleByName[name] : name;
  return <Title>{title}</Title>;
};

const TransactionSubTitle = (props) => {
  const { transaction } = props;
  const { name } = transaction;
  let subtitle = "";
  switch (name) {
    case "setUpOtp":
    case "enableOtp":
    case "disableOtp":
      const hyperWalletAccount = transaction.accounts.find(
        (a) => a.name == "hyperWallet"
      );
      if (hyperWalletAccount) {
        subtitle = `Hyper Wallet: ${middleEllipsis(
          hyperWalletAccount?.pubkey
        )}`;
      }
      break;
    case "transferSpl":
    case "transferLamports":
      const toAta = transaction.accounts.find((a) => a.name == "toAta");
      if (toAta) {
        subtitle = `To: ${middleEllipsis(toAta?.pubkey ?? "")}`;
      }
      break;
  }
  return <Subtitle>{subtitle}</Subtitle>;
};

const TransactionIcon = (props) => {
  const { transaction } = props;
  const { name } = transaction;
  if (["setUpOtp", "enableOtp", "disableOtp"].includes(name)) {
    return (
      <IconContainer>
        <Icon name="ri-shield-keyhole-fill" size={24} color="rgba(0,0,0,0.7)" />
      </IconContainer>
    );
  }
  if (["transferSpl", "transferLamports"].includes(name)) {
    return (
      <IconContainer>
        <Icon name="ri-send-plane-fill" size={24} color="rgba(0,0,0,0.7)" />
      </IconContainer>
    );
  }
  return (
    <IconContainer>
      <Icon name="ri-flashlight-fill" size={24} color="rgba(0,0,0,0.7)" />
    </IconContainer>
  );
};

export const TransactionItem: FC<TransactionItemProps> = (props) => {
  const { name, signature } = props;
  const viewInExplorer = () => {
    Linking.openURL(
      `https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  };
  return (
    <>
      <Container onPress={viewInExplorer}>
        <TransactionIcon transaction={props} />
        <Column>
          <Row>
            <TransactionTitle transaction={props} />
          </Row>
          <Row>
            <TransactionSubTitle transaction={props} />
          </Row>
        </Column>
      </Container>
    </>
  );
};
