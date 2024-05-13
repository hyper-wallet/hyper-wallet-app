import { SectionTitle, Space, Title } from "@/components";
import styled from "styled-components/native";
import { Icon } from "@/components";

const Container = styled.View`
  padding: 0 16px;
`;

const Card = styled.View`
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 4px 0;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  height: 48px;
  padding: 0 16px;
`;

export const BackupSection = () => {
  return (
    <Container>
      <SectionTitle>Backup</SectionTitle>
      <Space height={8} />
      <Card>
        <Row>
          <Icon name="ri-key-2-line" size={20} />
          <Space width={4} />
          <Title>Private Key</Title>
          <Space />
          <Icon name="ri-arrow-right-s-line" size={20} />
        </Row>
      </Card>
    </Container>
  );
};
