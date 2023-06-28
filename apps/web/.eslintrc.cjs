module.exports = {
  root: true,
  extends: ['next', 'next/core-web-vitals', '@project/eslint-config-custom'],
  rules: {
    '@next/next/no-img-element': 'off',
  },
}
