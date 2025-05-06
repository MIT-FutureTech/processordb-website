import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import tailwind from "eslint-plugin-tailwindcss";

export default defineConfig([
  {
    // Apply to all JS and Vue files.
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { pluginVue },
    extends: ["js/recommended"]
  },
  // Use Vue's "strongly-recommended" ruleset to enforce both error prevention and style guidelines.
  pluginVue.configs["vue3-strongly-recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: { globals: globals.browser },
    plugins: { pluginVue },
    rules: {
      "vue/multi-word-component-names": "off",
      "no-undef": "off"
    }
  },
  tailwind.configs["flat/recommended"],
]);