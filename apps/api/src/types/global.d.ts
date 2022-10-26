declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * NOTE: package.jsonのnpm-scriptsにて指定される
     */
    readonly NODE_ENV: 'production' | 'development'
  }
}
