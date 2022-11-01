const MIN_LENGTH_JWT_SECRET_KEY = 32 as const

export function getEnvFilePaths() {
  const paths: Array<string> = ['.env.local', '.env']
  if (process.env.NODE_ENV) {
    paths.unshift(`.env.${process.env.NODE_ENV}`)
    paths.unshift(`.env.${process.env.NODE_ENV}.local`)
  }
  return paths
}

export function validateEnv(config: Record<string, string>) {
  const { NODE_ENV, NEST_JWT_SECRET_KEY } = config

  if (!NODE_ENV || !['development', 'production'].includes(NODE_ENV)) {
    throw new Error('環境変数が未指定: NODE_ENV (development|production)')
  }

  if (!NEST_JWT_SECRET_KEY || NEST_JWT_SECRET_KEY.length < MIN_LENGTH_JWT_SECRET_KEY) {
    throw new Error('環境変数が未指定または条件を満たさない: NEST_JWT_SECRET_KEY (32文字以上)')
  }

  return config
}

export function isProductionEnv() {
  return process.env.NODE_ENV === 'production'
}

export function isDevelopmentEnv() {
  return process.env.NODE_ENV === 'development'
}
