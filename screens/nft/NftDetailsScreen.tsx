import { styled } from "styled-components/native";
import { FC } from "react";
import { ModalStackScreenProps } from "@/navigators";
import { Dimensions } from "react-native";
import { Button, Space, Image } from "@/components";
import { NftAttributes } from "./NftAttributes";

const WINDOW_WIDTH = Dimensions.get("window").width;

const MARGIN = 16;
const NFT_IMAGE_SIZE = WINDOW_WIDTH - MARGIN * 2;

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const NftImage = styled(Image)`
  width: ${NFT_IMAGE_SIZE}px;
  height: ${NFT_IMAGE_SIZE}px;
  align-self: center;
  border-radius: 8px;
`;

const Name = styled.Text`
  font-weight: 600;
  font-size: 24px;
  color: ${({ theme }) => theme.foreground.primary};
  margin-top: 16px;
  margin-bottom: 8px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.foreground.tertiary};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const NFTDetailsScreen: FC<ModalStackScreenProps<"NFTDetails">> = (
  props
) => {
  const { navigation, route } = props;
  const { nft } = route.params;
  const { metadata } = nft;
  const { name, symbol, image_uri, mint, attributes } = metadata;
  const send = () => {
    navigation.navigate("SendNft", { nft });
  };
  return (
    <Container>
      <NftImage
        source={{
          uri: image_uri,
        }}
      />
      <Name>{name}</Name>
      <Row>
        <Subtitle>Mint address</Subtitle>
        <Title style={{ width: 150 }} ellipsizeMode="middle" numberOfLines={1}>
          {mint}
        </Title>
      </Row>
      <Space height={16} />
      <Button label="Send" onPress={send} />
      <NftAttributes attributes={attributes} />
    </Container>
  );
};
