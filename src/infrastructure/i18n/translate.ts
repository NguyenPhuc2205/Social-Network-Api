/*
 * @Author: Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date: 2025-05-03 09:52:11
 * @LastEditors: Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime: 2025-05-04 15:00:00
 * @FilePath: /server/src/infrastructure/i18n/translate.ts
 * @Description: Utility for translating message keys
 */

import i18next from 'i18next'
import { MessageKeys, MESSAGES } from '~/shared/types/message-keys.type'

/**
 * Type definition for values that can be interpolated into translation strings
*/
export type InterpolationValues = Record<string, string | number | boolean | Date>

/**
 * Translates a message key to the corresponding text in the specified language
 * @param key - Message key to translate
 * @param values - Optional values to interpolate into the translated text
 * @param language - Optional language code to use for translation
 * @returns Translated string
*/
export const translate = (
  key: MessageKeys,
  values?: InterpolationValues,
  language?: string
): string => {
  return i18next.t(key, { ...values, lng: language })
}

// Example usage
// import { initializeI18n } from '~/infrastructure/i18n'
// initializeI18n()
// console.log(MESSAGES.BAD_REQUEST)
// const translatedText = translate(MESSAGES.BAD_REQUEST, { name: 'Phuc' }, 'en')
// console.log(translatedText)
