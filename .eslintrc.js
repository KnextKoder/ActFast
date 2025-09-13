// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo'],
  plugins: ['perfectionist', 'unused-imports'],
  rules: {
    'perfectionist/sort-imports': ['error'],
    'perfectionist/sort-interfaces': ['error'],
    'perfectionist/sort-objects': [
      'error',
      {
        type: 'alphabetical',
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        vars: 'all',
        varsIgnorePattern: '^_',
      },
    ],
  },
  settings: {
    perfectionist: {
      partitionByComment: true,
      type: 'line-length',
    },
  },
};
