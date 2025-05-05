/*
 * @Author: Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date: 2025-05-03 09:36:35
 * @LastEditors: Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime: 2025-05-04 12:54:33
 * @FilePath: /server/src/i18n/index.ts
 * @Description: i18n configuration for localization
 */
import i18next, { i18n } from 'i18next'
import middleware from 'i18next-http-middleware'
import Backend from 'i18next-fs-backend'
import { join } from 'path'
import { lookup } from 'dns'

/**
 * List of supported namespaces for translations files
 * @constant {string[]}
 * @description Each namespace corresponds to a separate JSON translation file in the locales directory.
 */
const namespaces = [
  'common',
  'user',
  'auth',
  'token',
  'profile',
  'notification',
  'follow',
  'tweet',
  'message',
  'reaction',
  'bookmark',
  'hashtag',
  'trend',
  'subscription',
  'payment',
  'report',
  'comment',
  'conversation',
] // List of namespaces

/**
 * Initializes the internationalization (i18n) system for the application.
 * 
 * @description
 * Configures i18next with filesystem backend and HTTP middleware for
 * language detection. Sets up default language (English), fallback options, 
 * and translation file loading paths from the locales directory.
 * 
 * This function must be called during application startup before any translation
 * features are used. The resulting i18n instance is attached to Express requests
 * via middleware.
 * 
 * @returns {Promise<i18n>} Promise that resolves to the configured i18next instance
 * 
 * @example
 * import express from 'express'
 * import { initializeI18n } from '~/infrastructure/i18n'
 * import middleware from 'i18next-http-middleware'
 * 
 * const app = express()
 * const i18nInstance = await initializeI18n()
 * app.use(middleware.handle(i18nInstance))
 * 
 * app.get('/hello', (req, res) => {
 *   res.send(req.t('common:WELCOME', { name: 'Phuc' }))
 * })
 */
export const initializeI18n = async (): Promise<i18n> => {
  await i18next
    .use(Backend) // Use the i18next-fs-backend plugin to load translations from JSON files
    .use(middleware.LanguageDetector) // Use the i18next-http-middleware plugin to detect the user's language (?lang=vi, cookie, accept-language) => Add req.language, req.t, req.i18n, req.languages
    .init({
      lng: 'en', // Default language
      fallbackLng: 'en', // Alternate language
      preload: ['en', 'vi'], // Preload languages
      supportedLngs: ['en', 'vi'], // Supported languages
      ns: namespaces,
      defaultNS: 'common',
      backend: {
        loadPath: join(__dirname, 'locales/{{lng}}/{{ns}}.json'), //Path to json files
      },
      detection: {
        lookupHeader: 'accept-language', // Header to check for language
        lookupQuerystring: 'lang', // Query string to check for language
        lookupCookie: 'lang', // Cookie name to check for language
        order: ['querystring', 'cookie', 'header'], // Order of detection. The library will detect the language in the order => attach to 'req.language'
        caches: ['cookie'] // Cache the language in a cookie},
      },
      interpolation: {
        escapeValue: false, // No espace cuz use in API, not HTML
      },
      returnObjects: true, // Allow returning objects, use for error code
    })

  return i18next
}

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

