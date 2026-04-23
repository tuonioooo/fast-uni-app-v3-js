const vuePlugin = require('eslint-plugin-vue');
const vueParser = require('vue-eslint-parser');
const { defineConfig } = require('eslint/config');
module.exports = defineConfig([
  {
    ignores: ['node_modules/**', 'unpackage/**', '.husky/**', 'docs/assets/**', 'uni_modules/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        App: 'readonly',
        Component: 'readonly',
        Page: 'readonly',
        getApp: 'readonly',
        getCurrentPages: 'readonly',
        uni: 'readonly',
        wx: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': [
        'warn',
        {
          args: 'none',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  ...vuePlugin.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        App: 'readonly',
        Component: 'readonly',
        Page: 'readonly',
        getApp: 'readonly',
        getCurrentPages: 'readonly',
        uni: 'readonly',
        wx: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-console': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': [
        'warn',
        {
          args: 'none',
          ignoreRestSiblings: true,
        },
      ],
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
]);
