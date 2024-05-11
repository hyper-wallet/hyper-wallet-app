if (typeof Buffer === "undefined") global.Buffer = require("buffer").Buffer;

// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
  protocol: "file:",
};

global.process.version = "v16.0.0";
if (!global.process.version) {
  global.process = require("process");
}

process.browser = true;
