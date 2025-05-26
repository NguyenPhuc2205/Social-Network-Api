/*
 * @Author: Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date: 2025-03-17 10:20:32
 * @LastEditors: Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime: 2025-05-22 14:20:28
 * @FilePath: /server/src/shared/types/translation-keys.type.ts
 * @Description: Type definitions for translation keys used in i18n
 */
import { CommonTranslationKeys } from '~/shared/enums/common-translation.enum'
import { AuthTranslationKeys } from '~/modules/auth/constants/auth-translations.enum'
import { FollowerTranslationKeys } from '~/modules/follower/constants/follower-translations.enum'
import { UserTranslationKeys } from '~/modules/users/constants/user-translations.enum'

export type TranslationKeys =
  | CommonTranslationKeys
  | AuthTranslationKeys
  | UserTranslationKeys
  | FollowerTranslationKeys

export const TRANSLATION_KEYS = {
  ...CommonTranslationKeys,
  ...AuthTranslationKeys,
  ...UserTranslationKeys,
  ...FollowerTranslationKeys,
} as const
