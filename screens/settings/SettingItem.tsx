import { styled } from "styled-components/native";
import { NFT } from "@/types";
import { FC } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Icon, Image, Space } from "@/components";

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
`;

const Title = styled.Text<{ color: string }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ color, theme }) => color ?? theme.foreground.primary};
`;

type SettingItemProps = TouchableOpacityProps & {
  iconName: string;
  title: string;
  color?: string;
  disableRightArrow?: boolean;
};

export const SettingItem: FC<SettingItemProps> = (props) => {
  const { iconName, title, color, disableRightArrow = false, ...rest } = props;
  return (
    <Container {...rest}>
      <Icon name={iconName} size={20} color={color} />
      <Title color={color}>{title}</Title>
      <Space />
      {!disableRightArrow && <Icon name="ri-arrow-right-s-line" size={20} />}
    </Container>
  );
};
