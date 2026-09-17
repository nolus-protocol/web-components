import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import vue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores(["dist/", "storybook-static/", "coverage/", "docs/", ".claude/"]),
  {
    files: ["**/*.{js,mjs,ts,vue}"],
    extends: [js.configs.recommended, tseslint.configs.recommended, vue.configs["flat/recommended"]],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        parser: tseslint.parser
      }
    },
    rules: {
      // Public component names (Button, Dialog, Table) are the library's API and predate the rule.
      "vue/multi-word-component-names": "off",
      // Props are typed with TypeScript; an optional prop without a default is undefined by design.
      "vue/require-default-prop": "off",
      // Named public props interfaces that extend a base without adding members are part of the API.
      "@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: "with-single-extends" }],
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "separate-type-imports" }],
      "vue/component-api-style": ["error", ["script-setup"]],
      eqeqeq: ["error", "always", { null: "ignore" }],
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "error"
    }
  },
  {
    files: ["scripts/**/*.mjs", "*.config.{js,ts}", ".storybook/**/*.ts", "src/shared/generate-icon-types.ts"],
    languageOptions: {
      globals: globals.node
    },
    rules: {
      "no-console": "off"
    }
  },
  prettier
);
