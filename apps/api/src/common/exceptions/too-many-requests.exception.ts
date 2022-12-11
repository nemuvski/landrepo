import { HttpException, HttpStatus } from '@nestjs/common'

class TooManyRequestsException extends HttpException {
  constructor(message?: string) {
    super(message ?? 'Too Many Requests', HttpStatus.TOO_MANY_REQUESTS)
  }
}

export default TooManyRequestsException
