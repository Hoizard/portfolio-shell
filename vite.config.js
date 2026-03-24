import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

const GITHUB_USER = "hoizard";

export default defineConfig({
  plugins: [
    react(),
    vue(),
    federation({
      name: "portfolio_shell",
      remotes: {
        mfe_vue_tasks: `https://${GITHUB_USER}.github.io/mfe-vue-tasks/dist/remoteEntry.js`,
        mfe_angular_counter: `https://${GITHUB_USER}.github.io/mfe-angular-counter/dist/remoteEntry.js`,
        mfe_react_weather: `https://${GITHUB_USER}.github.io/mfe-react-weather/dist/remoteEntry.js`,
      },
      shared: ["react", "react-dom", "vue"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
  },
  base: `https://${GITHUB_USER}.github.io/portfolio-shell/`,
});
