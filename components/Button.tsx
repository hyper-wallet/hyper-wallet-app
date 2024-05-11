import { FC } from "react";
import { styled } from "styled-components/native";
import { TouchableOpacityProps, Text } from "react-native";
import { useTheme } from "@/hooks";

type ButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: "primary" | "secondary";
};

const Container = styled.TouchableOpacity<{
  backgroundColor: string;
  borderColor: string;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 56px;
  border-width: 1px;
  border-color: ${({ borderColor }) => borderColor};
  border-radius: 999px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const Label = styled.Text<{ color: string }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ color }) => color};
`;

export const Button: FC<ButtonProps> = (props) => {
  const { variant = "primary", disabled } = props;
  const theme = useTheme();
  const backgroundColor =
    variant === "primary"
      ? theme.foreground.primary
      : theme.background.secondary;
  const borderColor =
    variant === "primary" ? theme.foreground.primary : theme.border.secondary;
  const color =
    variant === "primary" ? theme.background.primary : theme.foreground.primary;
  return (
    <Container
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      style={{ opacity: disabled ? 0.5 : 1 }}
      {...props}
    >
      <Label color={color}>{props.label}</Label>
    </Container>
  );
};
