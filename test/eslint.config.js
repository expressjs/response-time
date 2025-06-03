const mocha = require('eslint-plugin-mocha')
const baseConfigs = require('../eslint.config')

module.exports = [
  ...baseConfigs,
  mocha.configs.flat.recommended,
  {
    rules: {
      'mocha/no-sibling-hooks': 'off',
    }
  }
]
