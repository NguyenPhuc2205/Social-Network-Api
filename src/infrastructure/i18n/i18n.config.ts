/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-03 09:36:35
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-23 19:54:33
 * @FilePath      : /server/src/infrastructure/i18n/i18n.config.ts
 * @Description   : Configuration and Initialization for i18n (internationalization) in the application.
 */

import i18next, { i18n } from 'i18next'
import middleware from 'i18next-http-middleware'
import Backend from 'i18next-fs-backend'
import { join } from 'path'

/**
 * List of supported namespaces for translations files
 * @constant {string[]}
 * @description Each namespace corresponds to a separate JSON translation file in the locales directory.
 */
export const namespaces = [
  'auth',
  'bookmark',
  'comment',
  'common',
  'conversation',
  'follow',
  'hashtag',
  'message',
  'notification',
  'payment',
  'post',
  'profile',
  'reaction',
  'report',
  'subscription',
  'token',
  'report',
  'trend',
  'user',
  'validation',
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
 * @throws {Error} If the translation files cannot be loaded or initialization fails.
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
  try {
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
  } catch (error) {
    throw new Error(`Failed to initialize i18n: ${error}`)
  }
}

