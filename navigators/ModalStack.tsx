import {
  NFTDetailsScreen,
  TokenDetailsScreen,
  WalletAddressScreen,
  SendTokenScreen,
  RecoveryPhraseScreen,
  SelectSendTokenScreen,
  SelectWalletScreen,
  SendNftScreen,
  SendTokenReviewScreen,
  SendTokenResultScreen,
  WhitelistSettingScreen,
  SendTokenOtpScreen,
  OtpSettingScreen,
} from "@/screens";
import { WalletNft, WalletToken } from "@/types";
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

export type ModalStackParamList = {
  SelectWallet: undefined;
  TokenDetails: {
    token: WalletToken;
  };
  NFTDetails: {
    nft: WalletNft;
  };
  WalletAddress: undefined;
  SendToken: {
    token: WalletToken;
  };
  SendTokenReview: {
    token: WalletToken;
    toAddress: string;
    amount: number;
  };
  SendTokenOtp: {
    token: WalletToken;
    toAddress: string;
    amount: number;
    feeToken: "sol" | "usdt";
  };
  SendTokenResult: {
    token: WalletToken;
    toAddress: string;
    amount: number;
    otp?: string;
    feeToken: "sol" | "usdt";
  };
  SendNFT: {
    nft: WalletNft;
  };
  SendNftReview: {
    nft: WalletNft;
    toAddress: string;
  };
  SendNftResult: {
    nft: WalletNft;
    toAddress: string;
  };
  RecoveryPhrase: undefined;
  PrivateKey: undefined;
  SelectSendToken: undefined;
  OtpSetting: undefined;
  WhitelistSetting: undefined;
};

export type ModalStackScreenProps<T extends keyof ModalStackParamList> =
  NativeStackScreenProps<ModalStackParamList, T>;

const Stack = createNativeStackNavigator<ModalStackParamList>();

export const ModalStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="SelectWallet"
        component={SelectWalletScreen}
        options={{ title: "Select Wallet" }}
      />
      <Stack.Screen
        name="WalletAddress"
        component={WalletAddressScreen}
        options={{ title: "Wallet Address" }}
      />
      <Stack.Screen
        name="TokenDetails"
        component={TokenDetailsScreen}
        options={{
          title: "Details",
        }}
      />
      <Stack.Screen
        name="NFTDetails"
        component={NFTDetailsScreen}
        options={{ title: "Details" }}
      />
      <Stack.Screen
        name="SendNFT"
        component={SendNftScreen}
        options={{
          title: "Send NFT",
        }}
      />
      <Stack.Screen
        name="SelectSendToken"
        component={SelectSendTokenScreen}
        options={{ title: "Select Token" }}
      />
      <Stack.Screen
        name="SendToken"
        component={SendTokenScreen}
        options={{
          title: "Send Token",
        }}
      />
      <Stack.Screen
        name="SendTokenReview"
        component={SendTokenReviewScreen}
        options={{
          title: "Review",
        }}
      />
      <Stack.Screen
        name="SendTokenOtp"
        component={SendTokenOtpScreen}
        options={{
          title: "Otp",
        }}
      />
      <Stack.Screen
        name="SendTokenResult"
        component={SendTokenResultScreen}
        options={{
          title: "Result",
        }}
      />
      <Stack.Screen
        name="RecoveryPhrase"
        component={RecoveryPhraseScreen}
        options={{ title: "Recovery Phrase" }}
      />
      <Stack.Screen
        name="OtpSetting"
        component={OtpSettingScreen}
        options={{ title: "OTP Setting" }}
      />
      <Stack.Screen
        name="WhitelistSetting"
        component={WhitelistSettingScreen}
        options={{ title: "Whitelist Setting" }}
      />
    </Stack.Navigator>
  );
};
