/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-03 09:36:35
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-06 23:28:06
 * @FilePath      : /server/src/infrastructure/i18n/index.ts
 * @Description   : i18n configuration for localization
 */

import i18next from 'i18next'

export { 
  namespaces,
  initializeI18n
} from '~/infrastructure/i18n/i18n.config'

/**
 * The i18next instance for translation and localization.
 * 
 * @description
 * When using in middleware, it should be initialized first by calling initializeI18n().
 * This exported instance can be used for direct translation needs outside of request contexts.
 * 
 * The default language is English ('en') with Vietnamese ('vi') as an additional supported language.
 * 
 * @example
 * import i18next from '~/infrastructure/i18n'
 * 
 * const welcomeMessage = i18next.t('common:welcome', { 
 *   lng: 'en',
 *   name: 'Phuc'  // For template like "Welcome, {{name}}!"
 * })
 * 
 * const errorMessage = i18next.t('common:errors.NOT_FOUND', { lng: 'vi' })
 */
export default i18next

export {
  InterpolationValues,
  II18nService
} from '~/infrastructure/i18n/i18n.interface'

export {
  I18nService
} from '~/infrastructure/i18n/i18n.service'

export {
  translate
} from '~/infrastructure/i18n/translate'
