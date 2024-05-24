import { FC } from "react";
import { WalletTransaction } from "@/types";
import { styled } from "styled-components/native";
import { Icon, Subtitle } from "@/components";
import * as Linking from "expo-linking";
import { Image } from "expo-image";

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

const TransactionIcon = (props) => {
  const { type, iconUrl } = props;
  if (!!iconUrl) {
    return (
      <Image source={{ uri: iconUrl }} style={{ width: 48, height: 48 }} />
    );
  }
  if (["setUpOtp", "enableOtp", "disableOtp"].includes(type)) {
    return (
      <IconContainer>
        <Icon name="ri-shield-keyhole-fill" size={24} color="rgba(0,0,0,0.7)" />
      </IconContainer>
    );
  }
  if (["transferSpl", "transferLamports"].includes(type)) {
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
  const { signature, type, title, subTitle, value, subValue, iconUrl } = props;
  const viewInExplorer = () => {
    Linking.openURL(
      `https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  };
  return (
    <Container onPress={viewInExplorer}>
      <TransactionIcon type={type} iconUrl={iconUrl} />
      <Column>
        <Row>
          <Title>{title}</Title>
          <Title>{value}</Title>
        </Row>
        <Row>
          <Subtitle>{subTitle}</Subtitle>
          <Subtitle>{subValue}</Subtitle>
        </Row>
      </Column>
    </Container>
  );
};
