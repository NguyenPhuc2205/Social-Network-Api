/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-10 16:53:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-10 16:56:18
 * @FilePath      : /server/src/infrastructure/i18n/i18n.module.ts
 * @Description   : Module for binding the i18n service to the InversifyJS container.
 */

import { Container } from 'inversify'
import { BindingCallback, DI_TYPES } from '~/core/providers'
import { II18nService } from '~/infrastructure/i18n/i18n.interface'
import { I18nService } from '~/infrastructure/i18n/i18n.service'

export const bindI18nModule: BindingCallback = (container: Container) => {
  container.bind<II18nService>(DI_TYPES.II18nService).to(I18nService)
}
