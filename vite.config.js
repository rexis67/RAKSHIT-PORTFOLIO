import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.API_PROXY_TARGET || "http://localhost:3001";

  return {
    plugins: [react()],
    test: {
      environment: "jsdom",
      setupFiles: "./client/src/test-setup.js",
      include: ["client/src/**/*.test.{js,jsx}", "server/**/*.test.js"]
    },
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true
        }
      }
    }
  };
});
