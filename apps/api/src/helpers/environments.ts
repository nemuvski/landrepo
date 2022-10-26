export function getEnvFilePaths() {
  const paths: Array<string> = ['.env.local', '.env']
  if (process.env.NODE_ENV) {
    paths.unshift(`.env.${process.env.NODE_ENV}`)
    paths.unshift(`.env.${process.env.NODE_ENV}.local`)
  }
  return paths
}

export function validateEnv(config: Record<string, string>) {
  const { NODE_ENV } = config

  if (!NODE_ENV || !['development', 'production'].includes(NODE_ENV)) {
    throw new Error('環境変数が未指定: NODE_ENV (development|production)')
  }

  return config
}
