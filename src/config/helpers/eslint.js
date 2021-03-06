const {rules} = require('eslint-config-airbnb-typescript/lib/shared')

const {hasAnyDep} = require('../../utils')
const {testMatch} = require('../jest.config')

const withBaseConfig = base => variant =>
  require.resolve(base + (variant ? `/${variant}` : ''))

const airbnb = withBaseConfig('eslint-config-airbnb-typescript')
const prettier = withBaseConfig('eslint-config-prettier')

const hasReact = hasAnyDep('react')

const buildConfig = ({withReact = false} = {}) => {
  const ifReact = (t, f) => (withReact || hasReact ? t : f)

  return {
    plugins: ['prettier', 'jest', ifReact('react-hooks')].filter(Boolean),
    extends: [
      ifReact(airbnb(), airbnb('base')),
      'plugin:jest/recommended',
      prettier(),
      prettier('@typescript-eslint'),
      ifReact(prettier('react')),
    ].filter(Boolean),
    rules: {
      'prettier/prettier': 'error',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: rules[
            'import/no-extraneous-dependencies'
          ][1].devDependencies.concat('jest/**'),
          optionalDependencies: false,
        },
      ],
    },
    overrides: [
      {
        files: testMatch,
        rules: {
          'no-empty': ['error', {allowEmptyCatch: true}],
        },
      },
    ],
  }
}

module.exports = {buildConfig}
