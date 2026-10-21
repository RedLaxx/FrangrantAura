import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative base so the same build works in a browser AND inside the
  // Capacitor Android WebView (which serves the bundle from file://).
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 5175,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 5175,
    allowedHosts: true,
  },
});
