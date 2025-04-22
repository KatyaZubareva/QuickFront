import { fileURLToPath } from "node:url";
import path from "node:path";
import js from "@eslint/js";
import globals from "globals";
import { configs } from "typescript-eslint";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import stylistic from "@stylistic/eslint-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  {
    ignores: [
      "dist/**",
      "**/*.d.ts",
      "node_modules/**",
      "postcss.config.cjs",
      "tailwind.config.js",
      "vite.config.ts"
    ]
  },
  js.configs.recommended,
  ...configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...reactRecommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname
      }
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...reactRecommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "jsx-quotes": ["error", "prefer-double"],
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true
        }
      ],
      "no-useless-escape": "off"
    }
  },
  {
    files: ["**/*.{js,cjs}"],
    languageOptions: {
      sourceType: "commonjs"
    }
  },
  {
    plugins: {
      "react-hooks": reactHooks,
      "@stylistic": stylistic
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-hooks/exhaustive-deps": [
        "warn",
        {
          additionalHooks: "(useNewMessage)"
        }
      ],
      "@stylistic/quotes": ["error", "double", {
        avoidEscape: true,
        allowTemplateLiterals: true
      }],
      "@stylistic/indent": ["error", 2, {
        SwitchCase: 1,
        ignoredNodes: [
          "PropertyDefinition[decorators]",
          "TSUnionType"
        ]
      }],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/jsx-quotes": ["error", "prefer-double"]
    }
  },
  {
    plugins: {
      "react-refresh": reactRefresh
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { 
          allowConstantExport: true,
          allowExportNames: ["App"]
        }
      ]
    }
  }
];