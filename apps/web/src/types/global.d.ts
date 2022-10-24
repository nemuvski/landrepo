declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'production' | 'development' | 'test'

    // 以下、アプリケーション内で利用するカスタムの環境変数の型定義
    readonly APP_VERSION: string
  }
}
