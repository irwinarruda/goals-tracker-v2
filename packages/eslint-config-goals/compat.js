const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

module.exports = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
