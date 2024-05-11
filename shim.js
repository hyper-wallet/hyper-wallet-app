import { getRandomValues as expoCryptoGetRandomValues } from "expo-crypto";
import "react-native-get-random-values";
import { polyfillWebCrypto } from "expo-standard-web-crypto";
polyfillWebCrypto();
import "react-native-url-polyfill";
import { Buffer } from "buffer";
global.Buffer = Buffer;

// getRandomValues polyfill
class Crypto {
  getRandomValues = expoCryptoGetRandomValues;
}

const webCrypto = typeof crypto !== "undefined" ? crypto : new Crypto();

(() => {
  if (typeof crypto === "undefined") {
    Object.defineProperty(window, "crypto", {
      configurable: true,
      enumerable: true,
      get: () => webCrypto,
    });
  }
})();

// Web3Auth
// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
  protocol: "file:",
};

global.process.version = "v16.0.0";
if (!global.process.version) {
  global.process = require("process");
}

process.browser = true;
