/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-03 23:22:37
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-26 15:03:02
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
   * Cache for storing translation results
   * 
   * @private
   * @type {Map<string, string>}
   * @description
   * Stores translations keyed by language, translation key, and interpolation values hash.
   * Improves performance by avoiding redundant translations of the same content.
   * Cache entries follow format: `${language}_${key}:${valuesHash}`
   */
  private translationCache: Map<string, string> = new Map()

  /**
   * Cache for storing key existence check results
   * 
   * @private
   * @type {Map<string, boolean>}
   * @description
   * Stores results of checks whether a translation key exists in a particular language.
   * Improves performance by avoiding repeated existence checks for the same keys.
   * Cache entries follow format: `${language}_${key}`
   */
  private keyExistsCache: Map<string, boolean> = new Map()

  /**
   * Constructor for the I18nService
   * 
   * @constructor
   * @throws {AppError} Throws an error if i18next is not initialized
   * @description
   * Validates that i18next is properly initialized before allowing the service to be used.
   * This prevents unexpected behavior that would occur if translations were attempted
   * before the i18next library was ready.
   * Also sets up automatic cache cleaning to prevent memory leaks in long-running applications.
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

    // Set up periodic cache cleaning to prevent memory leaks
    // Runs every hour (3600000ms) and limits each cache to 300 entries
    setInterval(() => {
      this.clearCaches(300)
    }, 3600000) // Clear caches every hour
  }

  /**
   * Generates a hash string from interpolation values for cache keys
   * 
   * @private
   * @param {InterpolationValues} [values] - The interpolation values to hash
   * @returns {string} A string representation of the values for use in cache keys
   * @description
   * Creates a deterministic hash string from interpolation values to use as part
   * of cache keys. This ensures that the same values always produce the same hash,
   * regardless of object property order.
   */
  private hashInterpolationValues(values?: InterpolationValues): string {
    // { name: 'Phuc', count: 5 } => [['name', 'Phuc'], ['count', 5]] => [['count', 5], ['name', 'Phuc']] => 'count:5|name:Phuc'
    if (!values) return ''
    return Object
      .entries(values)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Sort by keys to ensure consistent order
      .map(([key, value]) => `${key}:${value}`)
      .join('|')
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
    const lng = this.getLanguageFromRequest(req, language)
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
   * Uses caching to improve performance for frequently translated strings.
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
    // Get appropriate language based on priority
    const lng = this.getLanguageFromRequest(req, language);
    
    // Generate cache key (format: language_key:valuesHash)
    const valuesHash = this.hashInterpolationValues(values);
    const cacheKey = `${lng}_${key}:${valuesHash}`;

    // Check cache first for better performance
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey)! as string;
    }

    // Perform actual translation via i18next
    const translation = i18next.t(key, { ...values, lng });

    // Cache management: prevent memory leaks by limiting cache size
    if (this.translationCache.size >= 1000) {
      // Remove oldest 100 entries when cache exceeds 1000 entries
      const oldestKeys = Array.from(this.translationCache.keys()).slice(0, 100);
      oldestKeys.forEach(k => this.translationCache.delete(k));
    }
    
    // Store translation in cache for future use
    this.translationCache.set(cacheKey, translation);

    return translation;
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

      // Clear caches after changing language to avoid stale translations
      this.translationCache.clear()
      this.keyExistsCache.clear()
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

    // If no translation key provided, return fallback message or default
    if (!translationKey) {
      return message?.trim() || defaultMessage
    }

    // Determines current language from request or default
    const currentLanguage = req?.language || this.defaultLanguage

    // Check if the translation key exists in the current language
    // Note: This check appears to have a bug - it should check if this.hasTranslationKey(translationKey, currentLanguage)
    // But it's checking the function itself instead
    if (!this.hasTranslationKey(translationKey, currentLanguage)) {
      return message?.trim() || defaultMessage
    }

    try {
      // Translate the message using the translation key
      const translatedMessage = this.translate(translationKey, req, interpolationValues)

      // If we have a valid translation (not equal to the key itself)
      if (translatedMessage && translatedMessage.trim() !== translationKey) {
        return translatedMessage
      }

      // If we should prioritize the provided message over translation
      if (!prioritizeTranslated && message?.trim()) {
        return message
      }

      // Final fallback logic
      return translatedMessage !== translationKey 
        ? translatedMessage
        : (message?.trim() || defaultMessage)
    } catch (error) {
      // Gracefully handle any unexpected translation errors
      return message?.trim() || defaultMessage
    }
  }

  /**
   * Checks if a translation key exists in the specified language
   * 
   * @param {TranslationKeys} key - The translation key to check for existence
   * @param {string} [language] - Optional language code to check in (defaults to this.defaultLanguage)
   * @returns {boolean} Whether the translation key exists in the specified language
   * @description
   * Determines if a translation key exists in the i18next resources for the specified language.
   * Uses a cache to avoid repeated lookups of the same key. This is particularly useful for
   * conditional rendering based on translation availability.
   * 
   * @example
   * // Use a fallback UI if the welcome message isn't available in the user's language
   * if (!i18nService.hasTranslationKey('welcome:GREETING', userLanguage)) {
   *   // Show generic greeting instead
   * }
   */
  public hasTranslationKey(key: TranslationKeys, language?: string): boolean {
    const lng = language || this.defaultLanguage

    // Generate cache key
    const cacheKey = `${lng}_${key}`

    // Check cache first
    if (this.keyExistsCache.has(cacheKey)) {
      return this.keyExistsCache.get(cacheKey)! as boolean
    }

    // Check if the key exists in i18next for the specified language
    // Also check language base (e.g., 'en' for 'en-US') as a fallback
    const exists = i18next.exists(key, { lng }) || i18next.exists(key, { lng: lng.split('-')[0] })
  
    // Store the result in cache for faster future lookups
    this.keyExistsCache.set(cacheKey, exists)
  
    return exists
  }

  /**
   * Clear caches when they grow too large to prevent memory leaks
   * 
   * @private
   * @param {number} maxSize - Maximum allowed size for each cache
   * @description
   * Maintains cache size within limits by removing oldest entries when 
   * cache size exceeds the specified maximum. This prevents unbounded
   * growth of caches in long-running applications.
   */
  private clearCaches(maxSize: number = 500): void {
    // Clear translation cache if too large
    if (this.translationCache.size > maxSize) {
      // Remove oldest entries first (FIFO approach)
      const keysToDelete = Array.from(this.translationCache.keys()).slice(0, this.translationCache.size - maxSize);
      keysToDelete.forEach(k => this.translationCache.delete(k));
    }
    
    // Clear key exists cache if too large
    if (this.keyExistsCache.size > maxSize) {
      // Remove oldest entries first (FIFO approach)
      const keysToDelete = Array.from(this.keyExistsCache.keys()).slice(0, this.keyExistsCache.size - maxSize);
      keysToDelete.forEach(k => this.keyExistsCache.delete(k));
    }
  }

  /**
   * Lấy ngôn ngữ từ request hoặc fallback về ngôn ngữ mặc định
   * 
   * @private
   * @param {Request} [req] - Express request object chứa thông tin ngôn ngữ 
   * @param {string} [explicitLanguage] - Ngôn ngữ được chỉ định rõ ràng sẽ được ưu tiên
   * @returns {string} Mã ngôn ngữ để sử dụng
   * @description
   * Trích xuất mã ngôn ngữ từ các nguồn với thứ tự ưu tiên:
   * 1. Ngôn ngữ được cung cấp rõ ràng
   * 2. Ngôn ngữ từ request.language (được thiết lập bởi i18next-http-middleware)
   * 3. Ngôn ngữ mặc định
   */
  private getLanguageFromRequest(req?: Request, explicitLanguage?: string): string {
    return explicitLanguage || req?.language || this.defaultLanguage;
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
