/** @type {import('eslint').Linter.Config} */
const configs = {
  plugins: ['regexp', 'import'],
  extends: ['plugin:regexp/recommended', 'prettier'],
  rules: {
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        pathGroups: [],
        pathGroupsExcludedImportTypes: ['builtin', 'external'],
        alphabetize: { order: 'asc', caseInsensitive: true },
        warnOnUnassignedImports: true,
      },
    ],
  },
}

module.exports = configs
