import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootTab } from "./RootTab";
import { CreateWalletStack } from "./CreateWalletStack";
import { ModalStack, ModalStackParamList } from "./ModalStack";
import { NavigatorScreenParams } from "@react-navigation/native";
import {useAppStore} from "@/stores/appStore";

export type AppStackParamList = {
  RootTab: undefined;
  CreateWalletStack: undefined;
  ModalStack: NavigatorScreenParams<ModalStackParamList>;
};

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => {
  const { solanaWallet } = useAppStore();
  const hasWallet = !!solanaWallet;

  return (
    <Stack.Navigator
      initialRouteName={hasWallet ? "RootTab" : "CreateWalletStack"}
    >
      {hasWallet ? (
        <>
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
        </>
      ) : (
        <Stack.Screen
          name="CreateWalletStack"
          component={CreateWalletStack}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};
