/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-30 15:00:02
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-31 00:19:56
 * @FilePath      : /server/src/configs/auth/index.ts
 * @Description   : Authentication configuration exports and bindings
 */
import { Container } from 'inversify'
import { IAuthConfig, AuthConfig } from '~/configs/auth/auth.config'
import { BindingCallback, DI_TYPES } from '~/core/providers'

export {
  authEnvSchema,
  AuthEnvSchema
} from '~/configs/auth/auth.env-schema'

export {
  IAuthConfig,
  AuthConfig
} from '~/configs/auth/auth.config'

export const bindAuthConfig: BindingCallback = (container: Container) => {
  container.bind<IAuthConfig>(DI_TYPES.IAuthConfig).to(AuthConfig).inSingletonScope()
}
