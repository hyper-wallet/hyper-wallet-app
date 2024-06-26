import AsyncStorage from "@react-native-async-storage/async-storage";

export class LocalStore {
  static async save(key: string, value: string) {
    return AsyncStorage.setItem(key, value);
  }
  static async get(key: string) {
    return AsyncStorage.getItem(key);
  }
  static async remove(key: string) {
    return AsyncStorage.removeItem(key);
  }
  static async clear() {
    return AsyncStorage.clear();
  }
}

export const LOCAL_STORE_KEYS = {
  OTP_MERKLE_TREE: "otp-merkle-tree",
  WALLET_SETTINGS: "wallet-settings",
  DEVICE_PK: "device-pk",
  CLOUD_PK: "cloud-pk",
  USER_PK: "user-pk",
};
