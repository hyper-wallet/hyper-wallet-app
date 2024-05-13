import { FC } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native";
import { RootTabScreenProps } from "@/navigators";
import { styled } from "styled-components/native";
import { NftItem } from "./NftItem";
import { EmptyState } from "@/components";
import { WalletNft } from "@/types";
import { useWalletNfts } from "@/hooks";

const WINDOW_WIDTH = Dimensions.get("window").width;

const COLS = 2;
const GAP = 12;
const PADDING = 16;
const NFT_SIZE = (WINDOW_WIDTH - PADDING * 2 - GAP * (COLS - 1)) / COLS;

const Gallery = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${GAP}px;
  padding: ${PADDING}px;
`;

export const NftScreen: FC<RootTabScreenProps<"NFT">> = ({ navigation }) => {
  const { nfts, refreshing, refresh } = useWalletNfts();

  function viewNFTDetails(nft: WalletNft) {
    navigation.navigate("ModalStack", {
      screen: "NFTDetails",
      params: {
        nft,
      },
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {!refreshing && !nfts.length && (
          <EmptyState
            label="You don't have any NFTs yet"
            style={{ marginTop: 16 }}
          />
        )}
        <Gallery>
          {nfts.map((nft) => (
            <NftItem
              key={nft.metadata.mint}
              size={NFT_SIZE}
              {...nft}
              onPress={() => viewNFTDetails(nft)}
            />
          ))}
        </Gallery>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
