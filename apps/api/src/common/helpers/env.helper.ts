import * as Joi from 'joi'

const MIN_LENGTH_JWT_SECRET_KEY = 32 as const

export function getEnvFilePaths() {
  const paths: Array<string> = ['.env.local', '.env']
  if (process.env.NODE_ENV) {
    paths.unshift(`.env.${process.env.NODE_ENV}`)
    paths.unshift(`.env.${process.env.NODE_ENV}.local`)
  }
  return paths
}

export const validationEnvSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  NEST_JWT_SECRET_KEY: Joi.string().min(MIN_LENGTH_JWT_SECRET_KEY).required(),
  NEST_JWT_REFRESH_SECRET_KEY: Joi.string().min(MIN_LENGTH_JWT_SECRET_KEY).required(),
  NEST_JWT_ONE_TIME_SECRET_KEY: Joi.string().min(MIN_LENGTH_JWT_SECRET_KEY).required(),
  NEST_MAILER_TRANSPORT_SMTP_HOST: Joi.string().required(),
  NEST_MAILER_TRANSPORT_SMTP_PORT: Joi.number().port().default(25),
  NEST_MAILER_TRANSPORT_INCOMING_USER: Joi.string().required(),
  NEST_MAILER_TRANSPORT_INCOMING_PASSWORD: Joi.string().required(),
  NEST_SITE_BASE_URL: Joi.string().uri().required(),
  NEST_LISTEN_PORT: Joi.number().port().default(4000),
})

export const validationEnvOptions: Joi.ValidationOptions = {
  allowUnknown: true,
  abortEarly: true,
}

export function getSiteUrlOrigin() {
  return new URL(process.env.NEST_SITE_BASE_URL).origin
}

export function isProductionEnv() {
  return process.env.NODE_ENV === 'production'
}

export function isDevelopmentEnv() {
  return process.env.NODE_ENV === 'development'
}
