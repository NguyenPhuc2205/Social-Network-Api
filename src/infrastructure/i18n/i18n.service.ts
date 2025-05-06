/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-03 23:22:37
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-07 00:17:20
 * @FilePath      : /server/src/infrastructure/i18n/i18n.service.ts
 * @Description   : Implementation of the I18n service for internationalization
 */

import { Request } from 'express'
import i18next, { TFunction } from 'i18next'
import { injectable } from 'inversify'
import { II18nService, InterpolationValues } from '~/infrastructure/i18n/i18n.interface'

/**
 * Service implementation for internationalization (i18n)
 * 
 * @class I18nService
 * @implements {II18nService}
 * @description 
 * Provides translation capabilities and language management across the application.
 * This service encapsulates i18next functionality and provides a simplified API for
 * controllers and other services to access translations.
 */
@injectable()
export class I18nService implements II18nService {
  /**
   * Default language to use when no language is specified
   * 
   * @private
   * @type {string}
   * @default 'en'
   * @description 
   * Falls back to this language when language detection fails or language is not specified
   */
  private defaultLanguage: string = 'en'

  /**
   * Gets a translation function (t) for the specified request and language
   * 
   * @param {Request} req - Express request object containing language information
   * @param {string} [language] - Optional override language code (e.g., 'en', 'vi')
   * @returns {TFunction} Translation function bound to the specified language
   * @description
   * Creates a translation function bound to the specified language.
   * 
   * @example
   * const t = i18nService.getTFunction(req)
   * 
   * const errorMessage = t('common:BAD_REQUEST')
   * const welcomeMessage = t('user:WELCOME', { name: req.user.name })
   * 
   * const vietnameseMessage = i18nService.getTFunction(req, 'vi')('common:BAD_REQUEST')
   */
  public getTFunction(req: Request, language?: string): TFunction {
    const lng = language || req.language || this.defaultLanguage
    return i18next.getFixedT(lng) // Creates a translation function bound to the specified language
  }

  /**
   * Translates a key into the corresponding text in the current language
   * 
   * @param {string} key - Translation key (e.g., 'common:not_found')
   * @param {Request} [req] - Optional Express request object for language detection
   * @param {InterpolationValues} [values] - Optional values for interpolation
   * @param {string} [language] - Optional override language code (e.g., 'en', 'vi')
   * @returns {string} Translated text
   * @description
   * Performs a one-time translation of the given key to text in the appropriate language.
   * 
   * @example
   * const errorMessage = i18nService.translate('common:BAD_REQUEST')
   * 
   * const welcomeMessage = i18nService.translate('user:WELCOME', req)
   * 
   * const notificationMessage = i18nService.translate(
   *   'notification:NEW_MESSAGES', 
   *   req, 
   *   { name: 'Phuc', count: 5 }
   * ) // 'Hello, Phuc! You have 5 new messages."
   */
  public translate(key: string, req?: Request, values?: InterpolationValues, language?: string): string {
    return i18next.t(key, { ...values, lng: language || req?.language || this.defaultLanguage })
  }
  
  /**
   * Gets the currently active language
   * 
   * @returns {string} Current language code (e.g., 'en', 'vi')
   * @description 
   * Returns the active language from i18next, falling back to the default if not set
   * 
   * @example
   * const currentLang = i18nService.getCurrentLanguage()
   * console.log(`App is running in ${currentLang} language`)
   */
  public getCurrentLanguage(): string {
    return i18next.language || this.defaultLanguage
  }
  
  /**
   * Changes the active language globally
   * 
   * @param {string} language - Language code to switch to (e.g., 'en', 'vi')
   * @returns {Promise<void>} Promise that resolves when the language has been changed
   * @description 
   * Changes the language for the entire application instance
   * 
   * @throws {Error} If the specified language is not supported
   * 
   * @example
   * await i18nService.changeLanguage('vi')
   * 
   * app.post('/v1/api/settings/language', async (req, res) => {
   *   const { language } = req.body
   *   await i18nService.changeLanguage(language)
   *   res.json({ success: true, language })
   * })
   */
  public async changeLanguage(language: string): Promise<void> {
    const supportedLanguages = i18next.options.supportedLngs
    
    if (!Array.isArray(supportedLanguages) || !supportedLanguages.includes(language)) {
      throw new Error(`Language ${language} is not supported`)
    }
    
    await i18next.changeLanguage(language)
  }
}

// Example usages
// import express from 'express'
// import cookieParser from 'cookie-parser'
// import { initializeI18n } from '~/infrastructure/i18n'
// import i18nMiddleware from 'i18next-http-middleware'
// const runTestServer = async () => {
//   const app = express()
//   app.use(cookieParser())

//   // Init i18n first 
//   const i18nInstance = await initializeI18n()

//   // Middleware add i18n to request (req.language, req.t, req.i18n, req.languages, req.i18n)
//   const i18nService = new I18nService()

//   app.use(i18nMiddleware.handle(i18nInstance))

//   app.get('/v1/api/test-i18n', (req, res, next) => {
//     const t = i18nService.getTFunction(req)
//     const greeting = t('common:GREETING', { name: 'Phuc' })
//     const error = t('common:BAD_REQUEST')

//     res.json({
//       language: req.language,
//       greeting,
//       error
//     })
//   })

//   const PORT = 3001
//   app.listen(PORT, () => {
//     console.log(`Test server is running at http://localhost:${PORT}/v1/api/test-i18n?lang=vi`)
//   })
// }
// runTestServer()
