declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'production' | 'development' | 'test'

    // 以下、アプリケーション内で利用するカスタムの環境変数の型定義
    readonly APP_VERSION: string

    readonly NEXT_PUBLIC_SITE_NAME: string
    readonly NEXT_PUBLIC_BASE_URL: string
    readonly NEXT_PUBLIC_API_ENDPOINT: string
    readonly NEXT_PUBLIC_API_GRAPHQL_ENDPOINT: string
  }
}
