import { FC, useState } from "react";
import { ModalStackScreenProps } from "@/navigators";
import { styled } from "styled-components/native";
import { PriceChange } from "./PriceChange";
import { Button, Space, Image } from "@/components";
import { MarketStats } from "./MarketStats";
import { About } from "./About";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Container = styled.ScrollView`
  flex: 1;
`;

const Name = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

const UsdPrice = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.foreground.tertiary};
`;

const Date = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.foreground.primary};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  flex-direction: column;
  align-items: ${({ align }) => align};
  gap: 4px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.background.secondary};
  margin: 16px 0px;
`;

const CoinIcon = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  margin: 16px;
`;

export const TokenDetailsScreen: FC<ModalStackScreenProps<"TokenDetails">> = (
  props
) => {
  const { navigation, route } = props;
  const { token } = route.params;
  const { balance, metadata, price } = token;
  const { name, symbol, image, mint_address } = metadata;
  const [stats, setStats] = useState({
    high_3m_usd: 0,
    high_24h_usd: 0,
    low_3m_usd: 0,
    low_24h_usd: 0,
  });
  const insets = useSafeAreaInsets();

  const send = () => {
    navigation.navigate("SendToken", {
      token,
    });
  };

  const viewWalletAddress = () => {
    navigation.navigate("WalletAddress");
  };

  return (
    <Container>
      <CoinIcon source={{ uri: image }} />
      <Row>
        <Name>{name}</Name>
        <PriceChange change={price.usd_24h_change.toFixed(2)} />
      </Row>
      <Row>
        <UsdPrice>${price.usd.toFixed(2)}</UsdPrice>
        <Date>Today</Date>
      </Row>
      <Space height={16} />
      <Row>
        <Column align="flex-start">
          <Subtitle>Balance</Subtitle>
          <Title>
            {balance.toFixed(2)} {symbol}
          </Title>
        </Column>
        <Column align="flex-end">
          <Subtitle>Value</Subtitle>
          <Title>
            ${(balance * (price.usd as unknown as number)).toFixed(2)}
          </Title>
        </Column>
      </Row>
      <Divider />

      <Row>
        <Button
          style={{ flex: 1 }}
          label="Receive"
          variant="secondary"
          onPress={viewWalletAddress}
        />
        <Space width={16} />
        <Button style={{ flex: 1 }} label="Send" onPress={send} />
      </Row>

      <Divider />

      <MarketStats
        stats={stats}
        marketCap={price.usd_market_cap}
        volume={price.usd_24h_vol}
      />

      <Divider />

      <About supply={0} mint_address={mint_address} />

      <Space height={insets.bottom} />
    </Container>
  );
};
