import * as Clipboard from "expo-clipboard";

export const copyStringToClipboard = async (string) => {
  Clipboard.setStringAsync(string);
};

export const fetchStringFromClipboard = Clipboard.getStringAsync;
