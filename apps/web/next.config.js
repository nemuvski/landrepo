const isProductionMode = process.env.NODE_ENV === 'production'
const packageVersion = process.env.npm_package_version

/** @type {Array<{key:string; value:string}>} */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Download-Options',
    value: 'noopen',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: isProductionMode ? { exclude: ['error', 'warn'] } : false,
    emotion: {
      // productionモードでビルドするときはsourcemapは出力しない
      sourceMap: !isProductionMode,
    },
  },
  env: {
    APP_VERSION: isProductionMode ? packageVersion : `${packageVersion}-${process.env.NODE_ENV}`,
  },
  // HTTPレスポンスヘッダの設定
  async headers() {
    return [
      {
        // アプリケーションのすべてのルートに適用
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
