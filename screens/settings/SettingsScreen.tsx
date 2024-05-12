import { FC } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { RootTabScreenProps } from "@/navigators";
import { SettingItem } from "./SettingItem";
import { Divider, Space } from "@/components";
import { useTheme } from "@/hooks";
import { useAppStore } from "@/stores/appStore";
import { SecuritySection } from "./SecuritySection";
import { BackupSection } from "./BackupSection";
import { useNavigation } from "@react-navigation/native";

export const SettingsScreen: FC<RootTabScreenProps<"NFT">> = () => {
  const theme = useTheme();
  const { removeWallet } = useAppStore();

  return (
    <View style={styles.container}>
      <ScrollView>
        <Space height={16} />
        <BackupSection />
        <SecuritySection />
        <Divider />
        <SettingItem
          iconName="ri-delete-bin-7-line"
          title="Remove Wallet"
          color={theme.error.active}
          disableRightArrow
          onPress={removeWallet}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
