import goalsConfig from 'eslint-config-goals/react-library';

/** @type {import('eslint').Linter.Config[]} */
export default [{ ignores: ['eslint.config.js', 'tsup.config.ts', 'dist/**'] }, ...goalsConfig];
