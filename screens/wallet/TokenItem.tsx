import { TouchableOpacityProps, View } from "react-native";
import { styled } from "styled-components/native";
import { PriceChange } from "./PriceChange";
import { formatUnits } from "@/utils";
import { FC } from "react";
import { WalletToken } from "@/types";
import { Image } from "@/components";

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
`;
const CoinIcon = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.background.secondary};
`;
const Name = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.foreground.primary};
`;
const Balance = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.foreground.tertiary};
`;
const UsdBalance = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;
const BalanceColumn = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;
const PriceColumn = styled.View`
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

type TokenItemProps = TouchableOpacityProps & WalletToken;

export const TokenItem: FC<TokenItemProps> = (props) => {
  const { balance, metadata, price, ...rest } = props;
  const { name, symbol, image, decimals } = metadata;
  return (
    <Container {...rest}>
      <CoinIcon
        source={{
          uri: image,
        }}
      />
      <BalanceColumn>
        <Name>{name}</Name>
        <Balance>
          {balance.toFixed(2)} {symbol.toUpperCase()}
        </Balance>
      </BalanceColumn>
      <PriceColumn>
        <UsdBalance>
          ${(balance * (price.usd as unknown as number)).toFixed(2)}
        </UsdBalance>
        <PriceChange change={price.usd_24h_change?.toFixed(2)} />
      </PriceColumn>
    </Container>
  );
};
