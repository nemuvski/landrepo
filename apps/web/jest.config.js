const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // next.config.jsとテスト環境用のdotenvファイルが配置されたパス
  dir: './',
})

/** @type {import('@jest/types').Config.InitialOptions} */
const customJestConfig = {
  collectCoverage: false,

  // tsconfig.jsonのcompilerOptions.pathsの定義に合わせる
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },

  // テストの共通設定等のセットアップ用スクリプト
  // setupFiles: ['<rootDir>/jest.setup.ts'],

  // 対象とするテストコードのパスパターン
  testMatch: ['<rootDir>/src/**/__tests__/**/*.spec.ts', '<rootDir>/src/**/__tests__/**/*.spec.tsx'],

  testEnvironment: 'jsdom',
}

module.exports = createJestConfig(customJestConfig)
