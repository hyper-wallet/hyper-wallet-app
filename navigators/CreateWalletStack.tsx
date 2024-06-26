import { WelcomeScreen, ImportPrivateKeyScreen } from "@/screens";
import { SelectGenerateMethodScreen } from "@/screens/createWallet/SelectGenerateMethodScreen";
import { SelectImportMethodScreen } from "@/screens/createWallet/SelectImportMethodScreen";
import { WalletsPreviewScreen } from "@/screens/createWallet/WalletsPreviewScreen";
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
  WalletsPreview: {
    privateKey: string;
  };
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
        name="SelectGenerateMethod"
        component={SelectGenerateMethodScreen}
        options={{ title: "Create Wallet" }}
      />
      <Stack.Screen
        name="ImportPrivateKey"
        component={ImportPrivateKeyScreen}
        options={{ title: "Import with Private Key" }}
      />
      <Stack.Screen
        name="WalletsPreview"
        component={WalletsPreviewScreen}
        options={{ title: "Wallets Preview" }}
      />
    </Stack.Navigator>
  );
};
