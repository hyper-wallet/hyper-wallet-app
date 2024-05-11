import styled from "styled-components/native";

const Container = styled.View`
  background-color: ${({ theme }) => theme.background.secondary};
  align-items: center;
  justify-content: center;
  padding: 24px;
  height: 150px;
  border-radius: 16px;
  margin: 0px 16px;
`;

const Label = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.foreground.tertiary};
`;

export const EmptyState = ({ label, ...rest }) => {
  return (
    <Container {...rest}>
      <Label>{label}</Label>
    </Container>
  );
};
