import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootTab } from "./RootTab";
import { ModalStack, ModalStackParamList } from "./ModalStack";
import { NavigatorScreenParams } from "@react-navigation/native";
import {
  ExplorerSettingScreen,
  NetworkSettingScreen,
  WhitelistSettingScreen,
} from "@/screens";

export type AppStackParamList = {
  RootTab: undefined;
  ModalStack: NavigatorScreenParams<ModalStackParamList>;
  WhitelistSetting: undefined;
  ExplorerSetting: undefined;
  NetworkSetting: undefined;
  AuthenticationFailed: undefined;
};

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RootTab"
        component={RootTab}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ModalStack"
        component={ModalStack}
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WhitelistSetting"
        component={WhitelistSettingScreen}
        options={{
          title: "Whitelist",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="ExplorerSetting"
        component={ExplorerSettingScreen}
        options={{
          title: "Explorer",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="NetworkSetting"
        component={NetworkSettingScreen}
        options={{
          title: "Network",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};
