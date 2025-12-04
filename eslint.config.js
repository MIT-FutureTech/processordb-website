import globals from "globals";
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import tsparser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    ignores: [
      "coverage/**",
      "node_modules/**",
      ".nuxt/**",
      "dist/**",
      "playwright-report/**",
      "test-results/**",
      "30000/**"
    ]
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: pluginVue.parser,
      parserOptions: {
        parser: tsparser,
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "no-undef": "off",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "vue/no-unused-vars": ["warn", { "ignorePattern": "^_" }],
      "no-irregular-whitespace": "off"
    }
  },
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    rules: {
      "no-undef": "off"
    }
  },
  {
    files: ["**/server/**/*.js", "**/ecosystem.config.js", "**/tailwind.config.js"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-undef": "off"
    }
  },
  {
    files: ["**/.nuxt/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-undef": "off"
    }
  }
];