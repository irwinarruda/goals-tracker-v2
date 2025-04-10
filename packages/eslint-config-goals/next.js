const eslint = require('@eslint/js');
const prettierConfig = require('eslint-plugin-prettier/recommended');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const compat = require('./compat');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  eslint.configs.recommended,
  prettierConfig,
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript'),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
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
      'linebreak-style': ['error', 'unix'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'prettier/prettier': 'error',
    },
  },
];
