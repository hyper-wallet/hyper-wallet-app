import { useTheme } from "@/hooks";
import { styled } from "styled-components/native";

const Container = styled.View<{ background: string }>`
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 6px;
  background-color: ${({ background }) => background};
`;

const Text = styled.Text<{ color: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ color }) => color};
`;

export const PriceChange = ({ change }) => {
  const theme = useTheme();
  const hasChange = change != 0 && change != null && change != undefined;
  const background = hasChange
    ? change > 0
      ? theme.success.background
      : theme.error.background
    : theme.background.secondary;
  const color = hasChange
    ? change > 0
      ? theme.success._
      : theme.error._
    : theme.foreground.primary;
  return (
    <Container background={background}>
      <Text color={color}>{hasChange ? `${change}%` : "---"}</Text>
    </Container>
  );
};
