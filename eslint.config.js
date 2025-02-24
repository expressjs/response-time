const js = require('@eslint/js')
const neostandard = require('neostandard')
const node = require('eslint-plugin-n')
const promise = require('eslint-plugin-promise')
const markdown = require('eslint-plugin-markdown')

module.exports = [
  ...neostandard({
    ignores: ['node_modules', 'coverage'],
    files: ['**/*.js']
  }),
  ...markdown.configs.recommended,
  js.configs.recommended,
  node.configs['flat/recommended-script'],
  promise.configs['flat/recommended'],
  {
    languageOptions: {
      // See https://compat-table.github.io/compat-table/es2016plus/#node18_3
      ecmaVersion: 2022,
      sourceType: 'commonjs',
    },
    rules: {
    },
  },
]
