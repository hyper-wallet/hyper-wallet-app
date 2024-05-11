import { FC } from "react";
import { WalletTransaction } from "@/types";
import { styled } from "styled-components/native";
import { Icon } from "@/components";
import { useTheme } from "@/hooks";
import { formatUnits } from "@/utils";
import { Image } from "@/components";
import * as Linking from "expo-linking";
import { SOLANA_TOKEN } from "@/core";

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

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.background.secondary};
  align-items: center;
  justify-content: center;
`;
const CircleIcon = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 999px;
`;
const RoundedIcon = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;
const SwapIconContainer = styled.View`
  width: 40px;
  height: 40px;
`;
const SwapSentIcon = styled(Image)`
  width: 26px;
  height: 26px;
  position: absolute;
  top: 0;
  left: 0;
  border-width: 2px;
  border-color: ${({ theme }) => theme.background.primary};
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 999px;
`;
const SwapReceivedIcon = styled(Image)`
  width: 26px;
  height: 26px;
  position: absolute;
  bottom: 0;
  right: 0;
  border-width: 2px;
  border-color: ${({ theme }) => theme.background.primary};
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: 999px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.foreground.primary};
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.foreground.tertiary};
`;

const CategoryTitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.foreground.tertiary};
  padding-left: 16px;
  margin-top: 4px;
`;

const TransactionIcon: FC<TransactionIconType> = (props) => {
  const { type, coin, nft, info, coin_sent, coin_received } = props;
  const theme = useTheme();
  if (type === "default") {
    return (
      <IconContainer>
        <Icon
          name="ri-flashlight-fill"
          size={24}
          color={theme.foreground.primary}
        />
      </IconContainer>
    );
  }
  if (type === "solana") {
    return <CircleIcon source={{ uri: SOLANA_TOKEN.icon_url }} />;
  }
  if (type == "coin") {
    return <CircleIcon source={{ uri: coin?.icon_url }} />;
  }
  if (type == "nft") {
    return <RoundedIcon source={{ uri: nft?.image }} />;
  }
  if (type == "glow_id") {
    return <CircleIcon source={{ uri: info?.image }} />;
  }
  if (type == "swap") {
    return (
      <SwapIconContainer>
        <SwapSentIcon
          source={{
            uri:
              coin_sent.type == "sol"
                ? SOLANA_TOKEN.icon_url
                : coin_sent?.coin?.icon_url,
          }}
        />
        <SwapReceivedIcon
          source={{
            uri:
              coin_received.type == "sol"
                ? SOLANA_TOKEN.icon_url
                : coin_received?.coin?.icon_url,
          }}
        />
      </SwapIconContainer>
    );
  }
  if (type == "nft_marketplace") {
    return (
      <RoundedIcon
        source={{
          uri: "https://ord.cdn.magiceden.dev/static_resources/ME+logo.png",
        }}
      />
    );
  }
};

const TransactionValue: FC<TransactionValueType> = (props) => {
  const theme = useTheme();
  const { mode, amount, type, coin } = props;
  const color = mode == "positive" ? theme.success._ : theme.error._;
  const getValue = () => {
    if (type == "solana") {
      return `${mode == "positive" ? "+" : ""}${parseFloat(
        (parseInt(amount?.lamports) / 1000000000).toFixed(6).toString()
      )} SOL`;
    }
    if (type == "coin") {
      return `${formatUnits(amount?.units, coin.decimals).toFixed(2)} ${
        coin.symbol
      }`;
    }
  };
  return <Title style={{ color: color }}>{getValue()}</Title>;
};

export const TransactionItem: FC<TransactionItemProps> = (props) => {
  const { title, icon, subtitle, value } = props;
  const viewInExplorer = () => {
    // Linking.openURL(`https://explorer.solana.com/tx/${signature}`);
  };
  return (
    <>
      <Container onPress={viewInExplorer}>
        <CircleIcon source={{ uri: icon }} />
        <Column>
          <Row>
            <Title>{title}</Title>
            <Title>{value}</Title>
          </Row>
          <Row>
            <Subtitle numberOfLines={1}>{subtitle}</Subtitle>
          </Row>
        </Column>
      </Container>
    </>
  );
};
