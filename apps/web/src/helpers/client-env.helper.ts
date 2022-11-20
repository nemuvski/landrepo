import { envsafe, str, url } from 'envsafe'

/**
 * クライアントサイドで参照する環境変数
 *
 * @see {NodeJS.ProcessEnv}
 */
export const clientEnv = envsafe(
  {
    NODE_ENV: str({
      input: process.env.NODE_ENV,
      choices: ['development', 'test', 'production'],
    }),
    APP_VERSION: str({
      input: process.env.APP_VERSION,
    }),

    NEXT_PUBLIC_SITE_NAME: str({
      input: process.env.NEXT_PUBLIC_SITE_NAME,
    }),
    NEXT_PUBLIC_BASE_URL: url({
      input: process.env.NEXT_PUBLIC_BASE_URL,
    }),
    NEXT_PUBLIC_API_ENDPOINT: url({
      input: process.env.NEXT_PUBLIC_API_ENDPOINT,
    }),
    NEXT_PUBLIC_API_GRAPHQL_ENDPOINT: url({
      input: process.env.NEXT_PUBLIC_API_GRAPHQL_ENDPOINT,
    }),
  },
  { strict: true }
)
