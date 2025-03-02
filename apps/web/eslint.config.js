const goalsConfig = require('eslint-config-goals/next');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [{ ignores: ['eslint.config.js', 'next.config.js', 'dist/**', '.next/**'] }, ...goalsConfig];
