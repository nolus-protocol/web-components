import { defineConfig } from "vite";
import { fileURLToPath } from "url";

import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
// import ts from "typescript";

// const ignore = [".stories.ts", "components/index.ts", "components/types.ts"];

// const input = Object.fromEntries(
//   glob
//     .sync("src/**/*.{ts,vue}")
//     .filter((file) => {
//       console.log(file);

//       for (const i of ignore) {
//         if (file.includes(i)) {
//           return false;
//         }
//       }
//       if (file.includes("src/components")) {
//         return true;
//       }
//       return false;
//     })
//     .map((file) => {
//       return [
//         relative("src/components", file.slice(0, file.length - extname(file).length)),
//         fileURLToPath(new URL(file, import.meta.url))
//       ];
//     })
// );

// const include = [];

// for (const key in input) {
//   include.push(input[key]);
// }
// console.log(input);
export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "./tsconfig.app.json"
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  build: {
    cssCodeSplit: true,
    minify: true,
    modulePreload: false,
    lib: {
      entry: "src/index.ts",
      name: "web-components",
      formats: ["es", "cjs"],
      fileName: (format, name) => `${name}.${format === "es" ? "js" : "cjs"}`
    },
    rollupOptions: {
      output: {
        preserveModules: true,
        globals: {
          vue: "Vue"
        }
      },
      external: ["vue"]
    }
  }
});
