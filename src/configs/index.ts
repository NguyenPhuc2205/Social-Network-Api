import z from 'zod'
import { appEnvSchema } from '~/configs/app'
import { authEnvSchema } from '~/configs/auth'
import { databaseEnvSchema } from '~/configs/database'
import { cloudinaryEnvSchema } from '~/configs/cloudinary'
import { oAuthEnvSchema } from '~/configs/oauth'

export {
  IConfigService
} from '~/configs/config.interface'

export {
  ConfigService
} from '~/configs/config.service'

export {
  bindConfigsModule
} from '~/configs/config.module'

export const mergedEnvSchema = appEnvSchema
  .merge(authEnvSchema)
  .merge(databaseEnvSchema)
  .merge(cloudinaryEnvSchema)
  .merge(oAuthEnvSchema)

export type MergedEnvSchema = z.infer<typeof mergedEnvSchema>

export * from '~/configs/app'
export * from '~/configs/auth'
export * from '~/configs/database'
export * from '~/configs/cloudinary'
export * from '~/configs/oauth'
