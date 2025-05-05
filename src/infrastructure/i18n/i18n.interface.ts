/*
 * @Author: Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date: 2025-05-03 23:22:37
 * @LastEditors: Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime: 2025-05-04 10:35:48
 * @FilePath: /server/src/infrastructure/i18n/i18n.interface.ts
 * @Description: Interface for i18n (internationalization) service
 */

import { Request } from 'express'
import { TFunction } from 'i18next'

/**
 * Type definition for interpolation values used in translations
 *
 * @typedef {Object} InterpolationValues
 * @description 
 * Key-value pairs for dynamic values to be inserted into translation strings.
 * These values replace placeholders in translation templates, allowing for
 * dynamic content within otherwise static translation strings.
 * 
 * @example 
 * Translation JSON file:
 * {
 *   "GREETINGS": "Hello, {{name}}!",
 *   "NEW_MESSAGES": "You have {{count}} new message(s)",
 * }
 * 
 * Usage with interpolation values:
 * {
 *   name: "Phuc",          // Replaces {{name}} in translation
 *   count: 5,              // Replaces {{count}} in translation
 * }
 */
export type InterpolationValues = Record<string, string | number | boolean | Date>

/**
 * Interface for the I18n service
 * 
 * @interface II18nService
 * @description 
 * Provides translation and localization capabilities throughout the application.
 * This interface defines the contract for internationalization services, allowing
 * for different implementations while maintaining a consistent API for consumers.
 * It handles language detection, translation lookups, and dynamic content insertion
 * into translated strings.
 */
export interface II18nService {
  /**
   * Gets a translation function for the specified request and language
   * @param {Request} req - Express request object containing language information
   * @param {string} [language] - Optional override language code (e.g., 'en', 'vi')
   * @returns {TFunction} Translation function bound to the specified language
   * @description 
   * Returns an i18next TFunction that's bound to the language from the request
   * or the explicitly provided language. This function can then be used for
   * multiple translations with the same language context.
   */
  getTFunction(req: Request, language?: string): TFunction

  /**
   * Translates a key into the corresponding text in the current language
   * @param {string} key - Translation key (e.g., 'common:errors.not_found', 'user:profile.title')
   * @param {Request} [req] - Optional Express request object for language detection
   * @param {InterpolationValues} [values] - Optional values for interpolation within the translation
   * @param {string} [language] - Optional override language code (e.g., 'en', 'vi')
   * @returns {string} Translated text
   * @description
   * Performs a one-time translation of the given key to text in the appropriate language.
   * Language is determined in this priority order: explicit language parameter, 
   * language from request, default language.
   */
  translate(key: string, req?: Request, values?: InterpolationValues, language?: string): string

  /**
   * Gets the currently active language
   * @returns {string} Current language code (e.g., 'en', 'vi')
   * @description
   * Returns the globally active language for the application instance.
   * This can be used to make language-dependent decisions in the business logic.
   */
  getCurrentLanguage(): string

  /**
   * Changes the active language
   * @param {string} language - Language code to switch to (e.g., 'en', 'vi')
   * @returns {Promise<void>} Promise that resolves when the language has been changed
   * @description
   * Changes the language globally for the entire application instance.
   * This affects all future translations until changed again.
   */
  changeLanguage(language: string): Promise<void>
}
