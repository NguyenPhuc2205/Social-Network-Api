/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-03 09:52:11
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-06 01:17:25
 * @FilePath      : /server/src/infrastructure/i18n/translate.ts
 * @Description   : Utility for translating message keys
 */

import i18next from 'i18next'
import { InterpolationValues } from '~/infrastructure/i18n/i18n.interface'
import { TranslationKeys } from '~/shared/types'

/**
 * Translates a message key to the corresponding text in the specified language
 * 
 * @function translate
 * @param {TranslationKeys} key - Message key to translate (e.g., TRANSLATION_KEYS.BAD_REQUEST)
 * @param {InterpolationValues} [values] - Optional values to interpolate into the translated text
 * @param {string} [language] - Optional language code to use for translation (e.g., 'en', 'vi')
 * @returns {string} Translated string in the target language
 * @description
 * A utility function that provides a simple way to translate keys without creating an i18n service instance.
 * This function directly uses i18next to perform the translation with the specified language or
 * falls back to the currently active language if not specified.
 * 
 * @example
 * const errorMessage = translate(TRANSLATION_KEYS.BAD_REQUEST)
 * 
 * const welcomeMessage = translate(
 *   TRANSLATION_KEYS.WELCOME_MESSAGE, 
 *   { name: 'Phuc', date: new Date() }
 * )
 * 
 * const vietnameseError = translate(TRANSLATION_KEYS.NOT_FOUND, undefined, 'vi')
*/
export const translate = (
  key: TranslationKeys,
  values?: InterpolationValues,
  language?: string
): string => {
  return i18next.t(key, { ...values, lng: language })
}

// Example usage
// import { initializeI18n } from '~/infrastructure/i18n'
// import { MESSAGES } from '~/shared/types/message-keys.type'
// initializeI18n()
// console.log(MESSAGES.BAD_REQUEST)
// const translatedText = translate(MESSAGES.BAD_REQUEST, { name: 'Phuc' }, 'en')
// console.log(translatedText)
