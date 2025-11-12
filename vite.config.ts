import { defineConfig } from "vite";
import { fileURLToPath } from "url";

import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    dts({
      tsconfigPath: "./tsconfig.vite.json"
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  build: {
    cssMinify: "lightningcss",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      format: {
        comments: false
      }
    },
    lib: {
      entry: {
        main: "lib/main.ts",
        "tailwind.config": "tailwind.config.cjs"
      },
      name: "web-components",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        preserveModules: true,
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
        globals: {
          vue: "Vue"
        }
      }
    }
  }
});
