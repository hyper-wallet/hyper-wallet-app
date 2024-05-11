import { styled } from "styled-components/native";
import { SocialLink as SocialLinkType } from "@/types";
import { TouchableOpacityProps } from "react-native";
import { Icon } from "@/components";
import { FC } from "react";
import { useTheme } from "@/hooks";
import { capitalized } from "@/utils";

const Container = styled.TouchableOpacity`
  height: 28px;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.background.secondary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.border.secondary};
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.foreground.primary};
`;

type SocialLinkProps = TouchableOpacityProps & {
  platform: string;
  value: string;
};

const ICON_NAME_BY_PLATFORM: Record<string, string> = {
  twitter: "ri-twitter-fill",
  discord: "ri-discord-fill",
  website: "ri-global-line",
};

export const SocialLink: FC<SocialLinkProps> = (props) => {
  const { platform, value, ...rest } = props;
  const iconName = ICON_NAME_BY_PLATFORM[platform];
  const theme = useTheme();
  return (
    <Container {...rest}>
      <Icon name={iconName} size={16} color={theme.foreground.primary} />
      <Label>{capitalized(platform)}</Label>
    </Container>
  );
};
