const isProductionMode = process.env.NODE_ENV === 'production'
const packageVersion = process.env.npm_package_version

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: isProductionMode ? { exclude: ['error', 'warn'] } : false,
  },
  env: {
    APP_VERSION: isProductionMode ? packageVersion : `${packageVersion}-${process.env.NODE_ENV}`,
  },
}

module.exports = nextConfig
