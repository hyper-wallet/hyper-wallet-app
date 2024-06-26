import { styled } from "styled-components/native";
import { FC } from "react";
import { TouchableOpacityProps } from "react-native";
import { Icon, Space, Title } from "@/components";

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
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
      <Title style={{ color }}>{title}</Title>
      <Space />
      {!disableRightArrow && <Icon name="ri-arrow-right-s-line" size={20} />}
    </Container>
  );
};
