import "./shim.js";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme, Theme } from "@/theme";
import { AppStack } from "@/navigators";
import { View } from "react-native";
import { useEffect } from "react";
import { useAppStore } from "@/stores/appStore";

export default function App() {
  const theme: Theme = lightTheme;
  const appStore = useAppStore();

  useEffect(() => {
    appStore.init();
  }, []);

  if (!appStore.initialized) {
    return <View />;
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppStack />
        </GestureHandlerRootView>
      </NavigationContainer>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
