import AsyncStorage from "@react-native-async-storage/async-storage";

export class LocalStore {
  static async save(key: string, value: string) {
    return AsyncStorage.setItem(key, value);
  }
  static async get(key: string) {
    return AsyncStorage.getItem(key);
  }
}

export const LOCAL_STORE_KEYS = {
  OTP_MERKLE_TREE: "otp-merkle-tree",
  WALLET_SETTINGS: "wallet-settings",
};
