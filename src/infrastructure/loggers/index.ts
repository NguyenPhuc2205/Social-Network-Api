/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-06 22:42:38
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-10 16:55:30
 * @FilePath      : /server/src/infrastructure/loggers/index.ts
 * @Description   : Exports the Winston logger module and interfaces for use in other parts of the application.
 */

export {
  ILogContext,
  ILogParams,
  IWinstonLoggerService
} from '~/infrastructure/loggers/winston.interface'

export {
  WinstonLoggerService,
} from '~/infrastructure/loggers/winston.service'

export {
  bindWinstonLoggerModule
} from '~/infrastructure/loggers/winston.module'
