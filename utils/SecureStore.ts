import * as ExpoSecureStore from "expo-secure-store";

export class SecureStore {
  static async save(
    key: string,
    value: string,
    options?: ExpoSecureStore.SecureStoreOptions
  ) {
    return ExpoSecureStore.setItemAsync(key, value, options);
  }
  static async get(key: string, options?: ExpoSecureStore.SecureStoreOptions) {
    return ExpoSecureStore.getItemAsync(key, options);
  }
}

export const SECURE_STORE_KEYS = {
  OTP_MERKLE_TREE: "otp-merkle-tree",
  WALLET_SETTINGS: "wallet-settings",
  CLOUD_PK: "cloud-pl",
};
