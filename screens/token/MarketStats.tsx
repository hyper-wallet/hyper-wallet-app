import { Space } from "@/components";
import { MarkteStats as TMarketStats } from "@/types";
import { formatNumber } from "@/utils";
import { FC } from "react";
import { styled } from "styled-components/native";

type MarketStatsProps = {
  stats: TMarketStats;
  marketCap: any;
  volume: any;
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
  const { stats, marketCap, volume } = props;
  return (
    <Container>
      <SectionTitle>Market Stats</SectionTitle>
      <Space height={12} />
      <Row>
        <Column align="flex-start">
          <Subtitle>24H High</Subtitle>
          <Title>${stats.high_24h_usd.toFixed(2)}</Title>
        </Column>
        <Column align="flex-start">
          <Subtitle>24h Low</Subtitle>
          <Title>${stats.low_24h_usd.toFixed(2)}</Title>
        </Column>
        <Column align="flex-start">
          <Subtitle>24H Volume</Subtitle>
          <Title>${formatNumber(volume)}</Title>
        </Column>
      </Row>
      <Space height={8} />
      <Row>
        <Column align="flex-start">
          <Subtitle>3M High</Subtitle>
          <Title>${stats.high_3m_usd.toFixed(2)}</Title>
        </Column>
        <Column align="flex-start">
          <Subtitle>3M Low</Subtitle>
          <Title>${stats.low_3m_usd.toFixed(2)}</Title>
        </Column>
        <Column align="flex-start">
          <Subtitle>Market Cap</Subtitle>
          <Title>${formatNumber(marketCap)}</Title>
        </Column>
      </Row>
    </Container>
  );
};
