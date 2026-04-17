import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

const GITHUB_USER = "hoizard";
const isProd = process.env.NODE_ENV === "production";
const REPO_NAME = "portfolio-shell";

const remotes = isProd
  ? {
      // Production — fetch from live GitHub Pages deployments
      // mfe_vue_tasks: `https://${GITHUB_USER}.github.io/mfe-vue-tasks/dist/remoteEntry.js`,
      // mfe_angular_counter: `https://${GITHUB_USER}.github.io/mfe-angular-counter/dist/remoteEntry.js`,
      mfe_react_weather: `https://${GITHUB_USER}.github.io/mfe-react-weather/assets/remoteEntry.js`,
    }
  : {
      // Local dev — each MFE must be running via `npm run build && npm run preview`
      // Default preview ports are 4173, 4174, 4175 (increment if ports are taken)
      // mfe_vue_tasks: "http://localhost:4173/dist/remoteEntry.js",
      // mfe_angular_counter: "http://localhost:4174/dist/remoteEntry.js",
      mfe_react_weather: "/mfe-react-weather/assets/remoteEntry.js",
    };

export default defineConfig({
  plugins: [
    react(),
    vue(),
    federation({
      name: "portfolio_shell",
      remotes,
      shared: ["react", "react-dom", "vue"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    modulePreload: false,
  },
  base: `/${REPO_NAME}/`,
});
