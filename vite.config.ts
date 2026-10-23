/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  base: "/colorful-ear-trainer-v2/",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // Woweee, node has a webstorage thing now, so we need this to ignore it to use jsdom instead.
    // Node 25+ enables it by default; older versions don't recognize the flag and crash.
    execArgv:
      Number(process.versions.node.split(".")[0]) >= 25
        ? ["--no-webstorage"]
        : [],
    reporters: ["dot"],
  },
});
