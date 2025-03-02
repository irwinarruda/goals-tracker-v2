const goalsConfig = require('eslint-config-goals/nest');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [{ ignores: ['eslint.config.js', 'dist/**'] }, goalsConfig];
