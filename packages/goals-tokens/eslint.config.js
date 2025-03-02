const goalsConfig = require('eslint-config-goals/react-library');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [{ ignores: ['eslint.config.js', 'tsup.config.ts', 'dist/**'] }, ...goalsConfig];
