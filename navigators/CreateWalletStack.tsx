import { WelcomeScreen, ImportPrivateKeyScreen } from "@/screens";
import { SelectImportMethodScreen } from "@/screens/createWallet/SelectImportMethodScreen";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

export type CreateWalletStackParamList = {
  Welcome: undefined;
  ImportWallet: undefined;
  SelectImportMethod: undefined;
  SelectGenerateMethod: undefined;
  ImportPrivateKey: undefined;
  ImportRecoveryPhrase: undefined;
};

export type CreateWalletScreenProps<
  T extends keyof CreateWalletStackParamList
> = NativeStackScreenProps<CreateWalletStackParamList, T>;

const Stack = createNativeStackNavigator<CreateWalletStackParamList>();

export const CreateWalletStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectImportMethod"
        component={SelectImportMethodScreen}
        options={{ title: "Import Wallet" }}
      />
      <Stack.Screen
        name="ImportPrivateKey"
        component={ImportPrivateKeyScreen}
        options={{ title: "Import with Private Key" }}
      />
    </Stack.Navigator>
  );
};
