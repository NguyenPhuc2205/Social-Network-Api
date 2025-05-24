/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-03 23:22:37
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-23 21:59:41
 * @FilePath      : /server/src/infrastructure/i18n/i18n.service.ts
 * @Description   : Implementation of the I18n service for internationalization
 */

import { Request } from 'express'
import i18next, { TFunction } from 'i18next'
import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { II18nService, InterpolationValues } from '~/infrastructure/i18n/i18n.interface'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { TranslationKeys, TRANSLATION_KEYS } from '~/shared/types'

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
   * Default message to use when no message is available
   * 
   * @private
   * @static
   * @type {string}
   * @default 'Default message'
   * @description
   * Used as a last resort fallback when no translation and no provided message is available
   */
  private static DEFAULT_MESSAGE: string = 'Default message'

  /**
   * Constructor for the I18nService
   * 
   * @constructor
   * @throws {AppError} Throws an error if i18next is not initialized
   * @description
   * Validates that i18next is properly initialized before allowing the service to be used.
   * This prevents unexpected behavior that would occur if translations were attempted
   * before the i18next library was ready.
   */
  constructor() {
    if (!i18next.isInitialized) {
      throw new AppError({
        translationKey: TRANSLATION_KEYS.INTERNAL_SERVER_ERROR,
        message: 'i18next is not initialized.',
        statusCode: 500,
        code: 'I18N_NOT_INITIALIZED',
      })
    }
  }

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
      throw new AppError({
        translationKey: TRANSLATION_KEYS.BAD_REQUEST,
        message: `Language ${language} is not supported`,
        statusCode: HTTP_STATUS.BAD_REQUEST,
        code: RESPONSE_CODES.BAD_REQUEST.code,
      })
    }

    try {
      await i18next.changeLanguage(language)
    } catch (error) {
      throw new AppError({
        translationKey: TRANSLATION_KEYS.INTERNAL_SERVER_ERROR,
        message: `Failed to change language`,
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        code: RESPONSE_CODES.INTERNAL_SERVER_ERROR.code,
      })
    }
  }

  /**
   * Resolves a message using translation key or fallback to provided message
   * 
   * @param {Object} options - Options for resolving the message
   * @param {TranslationKeys} options.translationKey - Key to use for translation lookup
   * @param {string} [options.message] - Optional fallback message if translation fails
   * @param {Request} [options.req] - Optional Express request object for language detection
   * @param {string} [options.defaultMessage=DEFAULT_MESSAGE] - Optional default message if both translation and message fail
   * @param {InterpolationValues} [options.interpolationValues] - Optional values for interpolation within the translation
   * @param {boolean} [options.prioritizeTranslated=true] - Whether to prioritize translated text over provided message
   * @returns {string} Resolved message in appropriate language
   * @description
   * Resolves messages using a flexible priority system based on available translations and preferences.
   * This is particularly useful for error messages that may have both system-defined translations
   * and custom overrides from API handlers.
   * 
   * @example
   * return new ApiResponse({
   *   code: RESPONSE_CODES.SUCCESS.code,
   *   message: i18nService.resolveMessage({
   *     translationKey: TRANSLATION_KEYS.USER_CREATED,
   *     message: 'User profile created successfully',
   *     req: req,
   *     interpolationValues: { username: user.username }
   *   })
   * })
   * 
   * throw new AppError({
   *   translationKey: TRANSLATION_KEYS.VALIDATION_ERROR,
   *   message: 'Email format is invalid',
   *   prioritizeTranslated: false
   * })
   */
  public resolveMessage(options: {
    translationKey: TranslationKeys,
    message?: string,
    req?: Request,
    defaultMessage?: string,
    interpolationValues?: InterpolationValues,
    prioritizeTranslated?: boolean
  }): string {
    const {
      translationKey,
      message,
      req,
      defaultMessage = I18nService.DEFAULT_MESSAGE,
      interpolationValues,
      prioritizeTranslated = true
    } = options

    if (!translationKey) {
      return message?.trim() || defaultMessage
    }

    /**
     * Internal helper function to safely attempt translation
     * 
     * @returns {string|null} Translated message or null if translation failed
     * @description
     * Attempts to translate the provided key and returns the result if successful.
     * Returns null if translation fails or if the key was returned unchanged
     * (indicating i18next didn't find a matching translation).
     */
    const translateMessage = (): string | null => {
      try {
        // Translate the message key using translate method
        const translatedMessage = this.translate(translationKey, req, interpolationValues)
        // If i18next doesn't find a translation, it returns the key unchanged
        return translatedMessage !== translationKey ? translatedMessage : null
      } catch (error) {
        // Gracefully handle any translation errors
        return null
      }
    }

    if (prioritizeTranslated) {
      const translatedMessage = translateMessage();
      if (translatedMessage) return translatedMessage;
      return message?.trim() || defaultMessage;
    } else {
      if (message?.trim()) return message;
      const translatedMessage = translateMessage();
      return translatedMessage || defaultMessage;
    }
  }
}

// Example usages
// import express from 'express'
// import cookieParser from 'cookie-parser'
// import { initializeI18n } from '~/infrastructure/i18n'
// import i18nMiddleware from 'i18next-http-middleware'
// import { Response, NextFunction } from 'express'
// import { AuthTranslationKeys } from '~/modules/auth/constants/auth-translations.enum'
// const runTestServer = async () => {
//   const app = express()
//   app.use(cookieParser())

//   // Init i18n first 
//   const i18nInstance = await initializeI18n()

//   // Middleware add i18n to request (req.language, req.t, req.i18n, req.languages, req.i18n)
//   const i18nService = new I18nService()

//   app.use(i18nMiddleware.handle(i18nInstance))

//   app.get('/v1/api/test1', (req, res, next) => {
//     const t = i18nService.getTFunction(req)
//     const greeting = t('common:GREETING', { name: 'Phuc' })
//     const error = t('common:BAD_REQUEST')

//     res.json({
//       status: 'success',
//       message: greeting,
//       language: req.language,
//       error
//     })
//   })

//   app.get('/v1/api/test2/', (req: Request, res: Response, next: NextFunction) => {
//     const validationMessage = i18nService.resolveMessage({
//       translationKey: AuthTranslationKeys.TOKEN_REQUIRED,
//       req,
//       interpolationValues: { tokenType: "Verify Account Token" }
//     })

//     res.status(200).json({
//       status: 'success',
//       message: validationMessage,
//       language: req.language,
//     })
//   })

//   const PORT = 3001
//   app.listen(PORT, () => {
//     console.log(`Test case 1 is running at http://localhost:${PORT}/v1/api/test1?lang=vi`)
//     console.log(`Test case 2 is running at http://localhost:${PORT}/v1/api/test2?lang=en`)
//   })
// }
// runTestServer()
