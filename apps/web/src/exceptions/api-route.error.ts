const HttpStatus = {
  400: { code: 400, name: 'BadRequest' },
  401: { code: 401, name: 'Unauthorized' },
  402: { code: 402, name: 'PaymentRequired' },
  403: { code: 403, name: 'Forbidden' },
  404: { code: 404, name: 'NotFound' },
  405: { code: 405, name: 'MethodNotAllowed' },
  406: { code: 406, name: 'NotAcceptable' },
  407: { code: 407, name: 'ProxyAuthenticationRequired' },
  408: { code: 408, name: 'RequestTimeout' },
  409: { code: 409, name: 'Conflict' },
  410: { code: 410, name: 'Gone' },
  411: { code: 411, name: 'LengthRequired' },
  412: { code: 412, name: 'PreconditionFailed' },
  413: { code: 413, name: 'PayloadTooLarge' },
  414: { code: 414, name: 'URITooLong' },
  415: { code: 415, name: 'UnsupportedMediaType' },
  416: { code: 416, name: 'RangeNotSatisfiable' },
  417: { code: 417, name: 'ExpectationFailed' },
  418: { code: 418, name: 'ImATeapot' },
  421: { code: 421, name: 'MisdirectedRequest' },
  422: { code: 422, name: 'UnprocessableEntity' },
  423: { code: 423, name: 'Locked' },
  424: { code: 424, name: 'FailedDependency' },
  425: { code: 425, name: 'TooEarly' },
  426: { code: 426, name: 'UpgradeRequired' },
  428: { code: 428, name: 'PreconditionRequired' },
  429: { code: 429, name: 'TooManyRequests' },
  431: { code: 431, name: 'RequestHeaderFieldsTooLarge' },
  451: { code: 451, name: 'UnavailableForLegalReasons' },
  500: { code: 500, name: 'InternalServerError' },
  501: { code: 501, name: 'NotImplemented' },
  502: { code: 502, name: 'BadGateway' },
  503: { code: 503, name: 'ServiceUnavailable' },
  504: { code: 504, name: 'GatewayTimeout' },
  505: { code: 505, name: 'HTTPVersionNotSupported' },
  506: { code: 506, name: 'VariantAlsoNegotiates' },
  507: { code: 507, name: 'InsufficientStorage' },
  508: { code: 508, name: 'LoopDetected' },
  509: { code: 509, name: 'BandwidthLimitExceeded' },
  510: { code: 510, name: 'NotExtended' },
  511: { code: 511, name: 'NetworkAuthenticationRequired' },
} as const
type HttpStatusType = keyof typeof HttpStatus

type ErrorSourceType = 'gql' | 'others'

export type ApiRouteErrorResponse = {
  statusCode: HttpStatusType
  statusName: string
  message?: string
  source: ErrorSourceType
}

/**
 * Next.jsのAPI Routes機能中で発生したエラーを扱うErrorクラス
 */
export default class ApiRouteError extends Error {
  statusCode: HttpStatusType
  statusName: string
  errorSource: ErrorSourceType

  constructor(statusCode: HttpStatusType, message?: string) {
    let errorSource: ErrorSourceType = 'others'
    if (message && message.match(/^\[graphql\]/i)) {
      errorSource = 'gql'
      message = message.replace(/^\[graphql\]/i, '').trim()
    }

    super(message)
    this.name = this.constructor.name

    this.statusCode = HttpStatus[statusCode].code
    this.statusName = HttpStatus[statusCode].name
    this.errorSource = errorSource
  }

  formatResponseBody(): ApiRouteErrorResponse {
    return {
      statusCode: this.statusCode,
      statusName: this.statusName,
      message: this.message,
      source: this.errorSource,
    }
  }

  toString() {
    return `[${this.statusCode}] (${this.statusName}) ${this.message ?? ''}`.trimEnd()
  }
}

export function isApiRouteError(value: unknown): value is ApiRouteError {
  return value instanceof ApiRouteError && value.name === ApiRouteError.name
}
