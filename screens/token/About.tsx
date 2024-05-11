import { Space } from "@/components";
import { styled } from "styled-components/native";
import { SocialLink } from "./SocialLink";
import { formatNumber, formatUnits } from "@/utils";

const Container = styled.View``;

const Row = styled.View<{ justifyContent?: string; gap?: number }>`
  flex-direction: row;
  align-items: center;
  justify-content: ${({ justifyContent = "space-between" }) => justifyContent};
  padding: 0px 16px;
  gap: ${({ gap }) => gap}px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.foreground.primary};
  padding: 0px 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.foreground.primary};
  text-align: right;
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

export const About = ({ supply, mint_address, social_links = [] }) => {
  return (
    <Container>
      <SectionTitle>About</SectionTitle>
      <Space height={12} />

      <Row>
        <Subtitle>Total Supply</Subtitle>
        <Title numberOfLines={1}>{formatNumber(supply)}</Title>
      </Row>
      <Space height={8} />
      <Row>
        <Subtitle>Mint Address</Subtitle>
        <Title style={{ width: 150 }} ellipsizeMode="middle" numberOfLines={1}>
          {mint_address}
        </Title>
      </Row>

      <Space height={12} />
      <Row justifyContent="start" gap={8}>
        {social_links.map((social_link) => (
          <SocialLink
            key={social_link.platform}
            platform={social_link.platform}
            value={social_link.value}
          />
        ))}
      </Row>
    </Container>
  );
};
