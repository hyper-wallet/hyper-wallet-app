import { Space } from "@/components";
import { formatNumber } from "@/utils";
import { FC } from "react";
import { styled } from "styled-components/native";

type MarketStatsProps = {
  marketData: any;
};

const Container = styled.View``;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0px 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.foreground.primary};
  padding: 0px 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.foreground.tertiary};
`;

const Column = styled.View<{ align: string }>`
  flex: 1;
  flex-direction: column;
  align-items: ${({ align }) => align};
  gap: 4px;
`;

export const MarketStats: FC<MarketStatsProps> = (props) => {
  const { marketData } = props;
  return (
    <Container>
      <SectionTitle>Market Stats</SectionTitle>
      <Space height={12} />
      <Row>
        <Column align="flex-start">
          <Subtitle>24H High</Subtitle>
          <Title>${marketData.high_24h?.toFixed(2)}</Title>
        </Column>
        <Column align="flex-start">
          <Subtitle>24h Low</Subtitle>
          <Title>${marketData.low_24h?.toFixed(2)}</Title>
        </Column>
        <Column align="flex-start">
          <Subtitle>Total Volume</Subtitle>
          <Title>${formatNumber(marketData.total_volume)}</Title>
        </Column>
      </Row>
      <Space height={8} />
      <Row>
        <Column align="flex-start">
          <Subtitle>Market Cap</Subtitle>
          <Title>${formatNumber(marketData.market_cap)}</Title>
        </Column>
        <Column align="flex-start">
          <Subtitle>ATH</Subtitle>
          <Title>${marketData.ath?.toFixed(2)}</Title>
        </Column>
        <Column align="flex-start">
          <Subtitle>Market Cap Rank</Subtitle>
          <Title>{marketData.market_cap_rank}</Title>
        </Column>
      </Row>
    </Container>
  );
};
