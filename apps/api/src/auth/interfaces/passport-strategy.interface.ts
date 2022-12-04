import type { LocalStrategyValidateReturnType } from '$/auth/types/strategy.type'
import type { JwtPayload, JwtPayloadBase } from '@project/jwt'

export interface IPassportLocalStrategy {
  validate(email: string, passport: string): Promise<LocalStrategyValidateReturnType>
}

export interface IPassportJwtStrategy<P extends JwtPayloadBase = JwtPayload> {
  validate(payload: P): Promise<any>
}
