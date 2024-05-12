import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeScreenProps } from "@react-navigation/native";
import { AppStackParamList } from "./AppStack";
import {
  ActivityScreen,
  NftScreen,
  SettingsScreen,
  WalletScreen,
} from "@/screens";
import { ModalStackParamList } from "./ModalStack";
import { Icon } from "@/components";
import { useTheme } from "@/hooks";
import { WalletSelector } from "@/components/WalletSelector";

export type RootTabParamList = {
  Wallet: undefined;
  NFT: undefined;
  Activity: undefined;
  Settings: undefined;
};

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, T>,
    CompositeScreenProps<
      NativeStackScreenProps<AppStackParamList>,
      NativeStackScreenProps<ModalStackParamList>
    >
  >;

const BottomTab = createBottomTabNavigator<RootTabParamList>();

export const RootTab = () => {
  const theme = useTheme();
  return (
    <BottomTab.Navigator detachInactiveScreens={false}>
      <BottomTab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="ri-wallet-fill"
              size={24}
              color={
                focused ? theme.foreground.primary : theme.foreground.tertiary
              }
            />
          ),
          tabBarShowLabel: false,
          headerTitle: () => <WalletSelector />,
        }}
      />
      <BottomTab.Screen
        name="NFT"
        component={NftScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="ri-image-2-fill"
              size={24}
              color={
                focused ? theme.foreground.primary : theme.foreground.tertiary
              }
            />
          ),
          tabBarShowLabel: false,
        }}
      />
      <BottomTab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="ri-flashlight-fill"
              size={24}
              color={
                focused ? theme.foreground.primary : theme.foreground.tertiary
              }
            />
          ),
          tabBarShowLabel: false,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="ri-settings-2-fill"
              size={24}
              color={
                focused ? theme.foreground.primary : theme.foreground.tertiary
              }
            />
          ),
          tabBarShowLabel: false,
        }}
      />
    </BottomTab.Navigator>
  );
};
