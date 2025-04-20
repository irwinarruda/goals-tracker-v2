const eslint = require('@eslint/js');
const prettierConfig = require('eslint-plugin-prettier/recommended');
const reactCompiler = require('eslint-plugin-react-compiler');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const reactNative = require('eslint-plugin-react-native');
const tseslint = require('typescript-eslint');

/** @type {import('eslint').Linter.Config[]} */
module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'simple-import-sort': simpleImportSort,
      'react-compiler': reactCompiler,
      'react-native': reactNative,
    },
    rules: {
      'react/self-closing-comp': ['error', { component: true, html: true }],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'ignore' }],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: true,
          shorthandLast: true,
          multiline: 'ignore',
          ignoreCase: false,
          noSortAlphabetically: false,
          locale: 'auto',
        },
      ],
      'react-native/sort-styles': ['error', 'asc', { ignoreClassNames: false, ignoreStyleProperties: false }],
      'linebreak-style': ['error', 'unix'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'prettier/prettier': 'error',
      'react-compiler/react-compiler': 'error',
    },
    files: ['**/*.ts', '**/*.tsx'],
  },
);
