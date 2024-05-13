import "./shim.js";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme, Theme } from "@/theme";
import { AppStack, CreateWalletStack } from "@/navigators";
import { View } from "react-native";
import { useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import "react-native-reanimated";

export default function App() {
  const theme: Theme = lightTheme;
  const appStore = useAppStore();

  useEffect(() => {
    appStore.init();
  }, []);

  if (!appStore.initialized) {
    return <View />;
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
