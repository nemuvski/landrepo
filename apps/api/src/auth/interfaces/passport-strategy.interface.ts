import type { LocalStrategyValidateReturnType } from '$/auth/types/strategy.type'
import type { JwtPayload } from '@project/jwt'

export interface IPassportLocalStrategy {
  validate(email: string, passport: string): Promise<LocalStrategyValidateReturnType>
}

export interface IPassportJwtStrategy {
  validate<P extends JwtPayload = JwtPayload>(payload: P): Promise<any>
}
