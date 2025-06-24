/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-31 23:23:26
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-31 00:17:46
 * @FilePath      : /server/src/configs/database/index.ts
 * @Description   : Database configuration exports and bindings
 */

import { Container } from 'inversify'
import { IDatabaseConfig, DatabaseConfig } from '~/configs/database/database.config'
import { BindingCallback, DI_TYPES } from '~/core/providers'

export {
  databaseEnvSchema,
  DatabaseEnvSchema
} from '~/configs/database/database.env-schema'

export {
  IDatabaseConfig,
  DatabaseConfig
} from '~/configs/database/database.config'

export const bindDatabaseConfig: BindingCallback = (container: Container) => {
  container.bind<IDatabaseConfig>(DI_TYPES.IDatabaseConfig).to(DatabaseConfig).inSingletonScope()
}
