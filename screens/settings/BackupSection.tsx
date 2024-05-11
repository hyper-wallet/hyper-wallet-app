import { SectionTitle, Space, Title } from "@/components";
import styled from "styled-components/native";

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
  justify-content: space-between;
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
          <Title>Private Key</Title>
        </Row>
      </Card>
    </Container>
  );
};
