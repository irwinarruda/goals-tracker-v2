const eslint = require('@eslint/js');
const prettierConfig = require('eslint-plugin-prettier/recommended');
const reactCompiler = require('eslint-plugin-react-compiler');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const reactNative = require('eslint-plugin-react-native');
const compat = require('./compat');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  eslint.configs.recommended,
  ...compat.extends('eslint-config-expo'),
  prettierConfig,
  {
    plugins: {
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
      '@typescript-eslint/no-unused-vars': 'error',
      'prettier/prettier': 'error',
      'react-compiler/react-compiler': 'error',
    },
  },
];
