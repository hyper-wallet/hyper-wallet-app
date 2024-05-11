import { capitalized } from "@/utils";
import { FC } from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  padding: 16px 0px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.foreground.primary};
`;

const AttributesContainer = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  gap: 12px;
  margin-top: 8px;
`;

const AttributeContainer = styled.View`
  background-color: rgba(0, 0, 0, 0.05);
  padding: 8px 12px;
  border-radius: 12px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.foreground.tertiary};
`;

type NftAttributesProps = ViewProps & {
  attributes: {
    [k: string]: string | number;
  };
};
export const NftAttributes: FC<NftAttributesProps> = (props) => {
  const { attributes } = props;
  return (
    <Container>
      <SectionTitle>Attributes</SectionTitle>
      <AttributesContainer>
        {Object.keys(attributes).map((key) => (
          <AttributeContainer key={key}>
            <Subtitle>{capitalized(key)}</Subtitle>
            <Title>{capitalized(attributes[key].toString())}</Title>
          </AttributeContainer>
        ))}
      </AttributesContainer>
    </Container>
  );
};
