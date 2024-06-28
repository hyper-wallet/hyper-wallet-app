import "./shim.js";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme, Theme } from "@/theme";
import { AppStack, CreateWalletStack } from "@/navigators";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/appStore";
import "react-native-reanimated";
import { AuthenticationFailedScreen } from "./screens/authenticate/AuthenticationFailedScreen";
import * as LocalAuthentication from "expo-local-authentication";

export default function App() {
  const theme: Theme = lightTheme;
  const appStore = useAppStore();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    authenticate();
  }, []);

  async function authenticate() {
    LocalAuthentication.authenticateAsync({
      biometricsSecurityLevel: "strong",
    }).then(({ success }) => {
      if (success) {
        setAuthenticated(true);
      }
    });
  }

  useEffect(() => {
    appStore.init();
  }, []);

  if (!appStore.initialized) {
    return <View />;
  }

  if (!authenticated) {
    return <AuthenticationFailedScreen reauthenticate={authenticate} />;
  }

  const { hasWallet } = appStore;

  return (
    <ThemeProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer theme={theme}>
          {hasWallet ? <AppStack /> : <CreateWalletStack />}
        </NavigationContainer>
        <StatusBar style="dark" />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
