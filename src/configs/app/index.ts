/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-30 08:43:52
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-31 01:20:46
 * @FilePath      : /server/src/configs/app/index.ts
 * @Description   : Application configuration exports and bindings
 */

import { Container } from 'inversify'
import { AppConfig, IAppConfig } from '~/configs/app/app.config'
import { BindingCallback, DI_TYPES } from '~/core/providers'

export {
  appEnvSchema,
  AppEnvSchema
} from '~/configs/app/app.env-schema'

export {
  IAppConfig,
} from '~/configs/app/app.config'

export const bindAppConfig: BindingCallback = (container: Container) => {
  container.bind<IAppConfig>(DI_TYPES.IAppConfig).to(AppConfig).inSingletonScope()
}
