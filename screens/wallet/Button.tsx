import { FC } from "react";
import { TouchableOpacityProps } from "react-native";
import { styled } from "styled-components/native";
import { Icon } from "@/components";
import { useTheme } from "@/hooks";

const Container = styled.TouchableOpacity`
  align-items: center;
  gap: 4px;
`;

const IconContainer = styled.View`
  height: 64px;
  width: 64px;
  background-color: ${({ theme }) => theme.background.secondary};
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.border.secondary};
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.foreground.tertiary};
  font-size: 16px;
`;

type ButtonProps = TouchableOpacityProps & {
  iconName: string;
  label: string;
};

export const Button: FC<ButtonProps> = ({ iconName, label, ...rest }) => {
  const theme = useTheme();
  return (
    <Container {...rest}>
      <IconContainer>
        <Icon name={iconName} size={24} color={theme.foreground.primary} />
      </IconContainer>
      <Label>{label}</Label>
    </Container>
  );
};
