/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-10 16:46:10
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-10 22:32:44
 * @FilePath      : /server/src/infrastructure/loggers/winston.module.ts
 * @Description   : Module for binding the Winston logger to the InversifyJS container.
 */

import { Container } from 'inversify'
import { BindingCallback, DI_TYPES } from '~/core/providers'
import { IWinstonLoggerService } from '~/infrastructure/loggers/winston.interface'
import { WinstonLoggerService } from '~/infrastructure/loggers/winston.service'

export const bindWinstonLoggerModule: BindingCallback = (container: Container) => {
  container.bind<IWinstonLoggerService>(DI_TYPES.IWinstonLoggerService).to(WinstonLoggerService).inSingletonScope()
}
