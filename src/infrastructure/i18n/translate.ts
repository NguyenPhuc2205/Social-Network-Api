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
import { MessageKeys } from '~/shared/types'

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
// import { MESSAGES } from '~/shared/types/message-keys.type'
// initializeI18n()
// console.log(MESSAGES.BAD_REQUEST)
// const translatedText = translate(MESSAGES.BAD_REQUEST, { name: 'Phuc' }, 'en')
// console.log(translatedText)
