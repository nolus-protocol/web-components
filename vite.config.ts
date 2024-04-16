import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { glob } from "glob";
import { extname, relative, resolve } from "path";

import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

const ignore = [".stories.ts", "components/index.ts", "components/types.ts"];

const input = Object.fromEntries(
  glob
    .sync("src/**/*.{ts,vue}")
    .filter((file) => {
      console.log(file);

      for (const i of ignore) {
        if (file.includes(i)) {
          return false;
        }
      }
      if (file.includes("src/components")) {
        return true;
      }
      return false;
    })
    .map((file) => {
      console.log(file);
      return [
        // The name of the entry point
        // lib/nested/foo.ts becomes nested/foo
        relative("src/components", file.slice(0, file.length - extname(file).length)),
        // The absolute path to the entry file
        // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
        fileURLToPath(new URL(file, import.meta.url))
      ];
    })
);
console.log(input);
export default defineConfig({
  plugins: [
    vue()
    // dts({
    //   tsconfigPath: "./tsconfig.app.json",
    //   exclude: ["src/**/*.stories.ts"],
    //   compilerOptions: {
    //     types: ["node"]
    //   }
    //   // outDir: ["dist"],
    //   // include: ["env.d.ts", "src/**/*", "src/**/*.vue"],
    //   // compilerOptions: {
    //   //   module: ts.ModuleKind.ESNext,
    //   //   moduleResolution: ts.ModuleResolutionKind.Bundler,
    //   //   paths: {
    //   //     "@/*": ["./src/*"]
    //   //   }
    //   // }
    // })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  build: {
    lib: {
      entry: input,
      name: "web-components",
      fileName: "[name]",
      formats: ["es"]
    },
    rollupOptions: {
      output: {
        // manualChunks: {
        //   test: ["./src/components/atoms/button/Button.vue"],
        //   test: ["./src/components/atoms/boxes/Boxes.vue"]
        // }
        globals: {
          vue: "Vue"
        }
      },
      external: ["vue"]
    }
  }
});
