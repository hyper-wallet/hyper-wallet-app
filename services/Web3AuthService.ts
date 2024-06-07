import ISocialAuth from "./ISocialAuth";
import Web3Auth, {
  LOGIN_PROVIDER,
  OPENLOGIN_NETWORK,
} from "@web3auth/react-native-sdk";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import * as Linking from "expo-linking";
import Constants, { AppOwnership } from "expo-constants";

const resolvedRedirectUrl =
  Constants.appOwnership == AppOwnership.Expo
    ? Linking.createURL("web3auth", {})
    : Linking.createURL("web3auth", { scheme: "hyperwallet" });

class Web3AuthService implements ISocialAuth {
  private _web3auth: Web3Auth;

  constructor() {
    const clientId =
      "BJb2WxwMmM6p4gxWlukdOSvlS-Eavz4H_YszACAuUvcU6pbDSQWeg14iL8fkYfmtG4nG37GnJYsltAQS1nNkM1k";
    this._web3auth = new Web3Auth(WebBrowser, SecureStore, {
      clientId,
      network: OPENLOGIN_NETWORK.SAPPHIRE_DEVNET,
    });
  }

  async init() {
    return this._web3auth.init();
  }

  getPrivateKey() {
    return this._web3auth.ed25519Key;
  }

  async loginWithGoogle() {
    return this._web3auth.login({
      loginProvider: LOGIN_PROVIDER.GOOGLE,
      redirectUrl: resolvedRedirectUrl,
    });
  }

  async logout() {
    return this._web3auth.logout();
  }
}

export default Web3AuthService;
