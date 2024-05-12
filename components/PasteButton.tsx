import styled from "styled-components/native";
import { fetchStringFromClipboard } from "@/utils";
import { FC } from "react";

type PasteButtonProps = {
  onPasted: (value: string) => void;
};

const PillButton = styled.TouchableOpacity`
  height: 36px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.background.secondary};
  align-self: center;
  align-items: center;
  justify-content: center;
  padding: 0px 16px;
  margin-top: 8px;
`;

const PillButtonLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

export const PasteButton: FC<PasteButtonProps> = (props) => {
  const { onPasted } = props;
  const handlePress = () => {
    fetchStringFromClipboard().then(onPasted);
  };
  return (
    <PillButton onPress={handlePress}>
      <PillButtonLabel>Paste</PillButtonLabel>
    </PillButton>
  );
};
