declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * NOTE: package.jsonのnpm-scriptsにて指定される
     */
    readonly NODE_ENV: 'production' | 'development'

    /**
     * NOTE: dotenvファイルにて指定される
     */
    readonly NEST_SITE_BASE_URL: string
    readonly NEST_LISTEN_PORT: string
    readonly NEST_JWT_SECRET_KEY: string
    readonly NEST_JWT_REFRESH_SECRET_KEY: string
    readonly NEST_JWT_ONE_TIME_SECRET_KEY: string
    readonly NEST_MAILER_TRANSPORT_SMTP_HOST: string
    readonly NEST_MAILER_TRANSPORT_SMTP_PORT: string
    readonly NEST_MAILER_TRANSPORT_INCOMING_USER: string
    readonly NEST_MAILER_TRANSPORT_INCOMING_PASSWORD: string
  }
}
