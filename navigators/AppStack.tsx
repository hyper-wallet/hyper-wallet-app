import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootTab } from "./RootTab";
import { ModalStack, ModalStackParamList } from "./ModalStack";
import { NavigatorScreenParams } from "@react-navigation/native";

export type AppStackParamList = {
  RootTab: undefined;
  ModalStack: NavigatorScreenParams<ModalStackParamList>;
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
    </Stack.Navigator>
  );
};
