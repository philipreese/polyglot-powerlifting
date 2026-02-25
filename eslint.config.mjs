import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules/", ".svelte-kit/", ".next/", ".expo/", "dist/", "build/"],
  },
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }]
    }
  }
];
