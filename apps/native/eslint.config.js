const goalsConfig = require('eslint-config-goals/expo');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [{ ignores: ['eslint.config.js', 'dist/**', '.expo/**', '.expo-shared/**'] }, ...goalsConfig];
