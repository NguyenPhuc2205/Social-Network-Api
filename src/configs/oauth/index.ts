/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-31 23:23:26
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-31 00:07:49
 * @FilePath      : /server/src/configs/oauth/index.ts
 * @Description   : OAuth configuration exports and bindings
 */

import { Container } from 'inversify'
import { IOAuthConfig, OAuthConfig } from '~/configs/oauth/oauth.config'
import { BindingCallback, DI_TYPES } from '~/core/providers'

export {
  oAuthEnvSchema,
  OAuthEnvSchema
} from '~/configs/oauth/oauth.env-schema'

export {
  IOAuthConfig,
  OAuthConfig,
  GoogleOAuthConfig
} from '~/configs/oauth/oauth.config'

export const bindOAuthConfig: BindingCallback = (container: Container) => {
  container.bind<IOAuthConfig>(DI_TYPES.IOAuthConfig).to(OAuthConfig).inSingletonScope()
}
