import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.wordaura.game",
  appName: "Word Aura",
  webDir: "dist",
  backgroundColor: "#101014",
  android: {
    allowMixedContent: false,
    backgroundColor: "#101014",
  },
};

export default config;
