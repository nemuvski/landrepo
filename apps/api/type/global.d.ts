declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * NOTE: package.jsonのnpm-scriptsにて指定される
     */
    readonly NODE_ENV: 'production' | 'development'

    /**
     * NOTE: dotenvファイルにて指定される
     */
    readonly NEST_JWT_SECRET_KEY: string
  }
}
