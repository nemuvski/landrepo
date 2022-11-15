import type { JwtPayload } from '$/auth/types/jwt-payload.type'
import type { LocalStrategyValidateReturnType } from '$/auth/types/strategy.type'

export interface IPassportLocalStrategy {
  validate(email: string, passport: string): Promise<LocalStrategyValidateReturnType>
}

export interface IPassportJwtStrategy {
  validate<P extends JwtPayload = JwtPayload>(payload: P): Promise<any>
}
