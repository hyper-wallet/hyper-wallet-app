import { styled } from "styled-components/native";
import { WalletNft } from "@/types";
import { FC } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Image } from "@/components";

const NFTImage = styled(Image)<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 8px;
`;

const TitleContainer = styled.View`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px 6px;
  border-radius: 4px;
`;

const Title = styled.Text`
  color: white;
`;

type NFTItemProps = TouchableOpacityProps &
  WalletNft & {
    size: number;
  };

export const NftItem: FC<NFTItemProps> = (props) => {
  const { metadata, size, ...rest } = props;
  const { name, image_uri } = metadata;
  return (
    <TouchableOpacity {...rest}>
      <NFTImage size={size} source={{ uri: image_uri }} />
      <TitleContainer>
        <Title>{name}</Title>
      </TitleContainer>
    </TouchableOpacity>
  );
};
