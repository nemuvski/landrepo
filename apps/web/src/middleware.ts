export * from '~/modules/auth/middlewares/rotate-token.middleware'

export const config = {
  matcher: [
    /*
     * 以下のパターンのパスは除外
     *
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|favicon.ico).*)',
  ],
}
