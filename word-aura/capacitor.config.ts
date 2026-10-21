import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.wordaura.game",
  appName: "Word Aura",
  webDir: "dist",
  backgroundColor: "#f5f4f0",
  android: {
    allowMixedContent: false,
    backgroundColor: "#f5f4f0",
  },
};

export default config;
