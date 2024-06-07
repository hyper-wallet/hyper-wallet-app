import { Button, Space } from "@/components";
import { ModalStackScreenProps } from "@/navigators";
import { FC, useState } from "react";
import { styled } from "styled-components/native";
import { Image } from "expo-image";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useAppStore } from "@/stores/appStore";
import { fetchStringFromClipboard } from "@/utils";

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const NftImage = styled(Image)`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Input = styled.TextInput`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
  margin: 4px 0px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.foreground.tertiary};
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.background.secondary};
  margin: 16px 0px;
`;

const PillButton = styled.TouchableOpacity`
  height: 32px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.background.secondary};
  align-self: center;
  align-items: center;
  justify-content: center;
  padding: 0px 16px;
`;

const PillButtonLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.foreground.primary};
`;

export const SendNftScreen: FC<ModalStackScreenProps<"SendNft">> = (props) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const appStore = useAppStore();

  const { navigation, route } = props;
  const { nft } = route.params;

  const { metadata } = nft;
  const { name, symbol, image_uri, mint } = metadata;
  const { currentWallet } = appStore;

  function paste() {
    fetchStringFromClipboard().then(setRecipientAddress);
  }

  function reviewSend() {
    navigation.navigate("SendNftReview", {
      nft,
      toAddress: recipientAddress,
    });
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <NftImage source={{ uri: image_uri }} />
        <Space height={4} />
        <Subtitle>Sending:</Subtitle>
        <Title>{name}</Title>
        <Space height={16} />
        <Subtitle>Send to:</Subtitle>
        <Row>
          <Input
            placeholder="Enter Recipient address"
            value={recipientAddress}
            onChangeText={setRecipientAddress}
            clearButtonMode="while-editing"
            placeholderTextColor="rgba(0,0,0,0.3)"
          />
          <PillButton onPress={paste}>
            <PillButtonLabel>Paste</PillButtonLabel>
          </PillButton>
        </Row>
        <Divider />
        {/* <Row>
          <Subtitle>Available</Subtitle>
          <Title>{mint.supply}</Title>
        </Row> */}
        <Space height={4} />
        {/* <Row>
          <Subtitle>Network fee</Subtitle>
          <Title>0.000005 SOL</Title>
        </Row> */}
        <Space />
        <Button
          label="Review"
          onPress={reviewSend}
          disabled={!recipientAddress}
        />
        <Space insetBottom />
      </Container>
    </TouchableWithoutFeedback>
  );
};
