/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-28 13:19:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-28 15:23:05
 * @FilePath      : /server/src/configs/config.module.ts
 * @Description   : Module for binding the ConfigService to the InversifyJS container.
 */

import { Container } from 'inversify'
import { IConfigService } from '~/configs/config.interface'
import { ConfigService } from '~/configs/config.service'
import { BindingCallback, DI_TYPES } from '~/core/providers'

/**
 * Binding callback function that registers the ConfigService with the InversifyJS container
 * @function bindConfigModule
 * @param {Container} container - The InversifyJS container to bind services to
 * @returns {void}
 */
export const bindConfigsModule: BindingCallback = (container: Container) => {
  container.bind<IConfigService>(DI_TYPES.IConfigService).to(ConfigService).inSingletonScope()
}
