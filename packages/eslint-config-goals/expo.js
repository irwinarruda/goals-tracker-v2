const expoConfig = require('eslint-config-expo');
const prettierConfig = require('eslint-plugin-prettier/recommended');
const reactCompiler = require('eslint-plugin-react-compiler');
const prettier = require('eslint-plugin-prettier/recommended');

module.exports = [
  prettierConfig,
  expoConfig,
  {
    plugins: {
      prettier: prettier,
      'react-compiler': reactCompiler,
    },
    rules: {
      'prettier/prettier': 'error',
      'react-compiler/react-compiler': 'error',
    },
  },
];
