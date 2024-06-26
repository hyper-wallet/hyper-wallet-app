import { Subtitle, Title } from "@/components";
import { palette } from "@/theme/palette";
import { FC } from "react";
import styled from "styled-components/native";

type FeeTokenSelector = {
  feeToken: "SOL" | "USDT";
  setFeeToken: (value: "SOL" | "USDT") => void;
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  gap: 16px;
`;

const Card = styled.TouchableOpacity<{ active: boolean }>`
  border-radius: 16px;
  background-color: ${({ theme }) => theme.background.secondary};
  padding: 16px;
  flex: 1;
  border: 1px solid ${(p) => (p.active ? palette.gray[90] : palette.gray[10])};
`;

export const FeeTokenSelector: FC<FeeTokenSelector> = (props) => {
  const { feeToken, setFeeToken } = props;
  return (
    <Container>
      <Card onPress={() => setFeeToken("sol")} active={feeToken == "sol"}>
        <Title>Solana</Title>
        <Subtitle>0.000005 SOL</Subtitle>
      </Card>
      <Card onPress={() => setFeeToken("usdt")} active={feeToken == "usdt"}>
        <Title>USDT</Title>
        <Subtitle>0.000015 USDT</Subtitle>
      </Card>
    </Container>
  );
};
