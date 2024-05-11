import styled from "styled-components/native";

export const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.foreground.secondary};
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.foreground.primary};
`;
