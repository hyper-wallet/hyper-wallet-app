import Web3Auth, { OPENLOGIN_NETWORK } from "@web3auth/react-native-sdk";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { clusterApiUrl } from "@solana/web3.js";

const clientId =
  "BJb2WxwMmM6p4gxWlukdOSvlS-Eavz4H_YszACAuUvcU6pbDSQWeg14iL8fkYfmtG4nG37GnJYsltAQS1nNkM1k";
const chainConfig = {
  chainNamespace: "solana",
  chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
  rpcTarget: clusterApiUrl("devnet"),
  displayName: "Solana Devnet",
  blockExplorerUrl: "https://explorer.solana.com",
  ticker: "SOL",
  tickerName: "Solana",
  logo: "https://images.toruswallet.io/solana.svg",
};

export const privateKeyProvider = new SolanaPrivateKeyProvider({
  //@ts-ignore
  config: { chainConfig },
});

export const web3auth = new Web3Auth(WebBrowser, SecureStore, {
  clientId,
  network: OPENLOGIN_NETWORK.SAPPHIRE_DEVNET,
});
