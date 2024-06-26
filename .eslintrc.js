module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['airbnb', 'airbnb-typescript', 'airbnb-typescript/base', 'plugin:i18next/recommended', 'plugin:storybook/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './babel.config.json']
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'i18next'
  ],
  rules: {
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/jsx-indent': [2, 2],
    'react/jsx-indent-props': [2, 2],
    indent: [2, 2],
    'react/jsx-filename-extension': [2, {
      extensions: ['.js', '.jsx', '.tsx']
    }],
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-unused-vars': 'warn',
    'react/require-default-props': 'off',
    'react/button-has-type': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'warn',
    'react/function-component-definition': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    'array-callback-return': 'off',
    'no-spaced-func': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'max-len': ['error', {
      'code': 300
    }],
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],  },
  globals: {
    __IS_DEV__: true,
    __API__: true
  }
};
