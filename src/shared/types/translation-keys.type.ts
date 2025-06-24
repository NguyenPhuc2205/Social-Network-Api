/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-06 21:43:17
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-24 08:34:20
 * @FilePath      : /project/server/src/shared/types/translation-keys.type.ts
 * @Description   : Intermediary key between code and the i18n translation file. Provides type safety and autocompletion.
 */

import { CommonTranslationKeys, ValidationTranslationKeys, SuggestionTranslationKeys } from '~/shared/enums'
import { AuthTranslationKeys } from '~/modules/auth/constants'
import { UserTranslationKeys } from '~/modules/users/constants'
import { FollowerTranslationKeys } from '~/modules/follower/constants'
import { CommentTranslationKeys } from '~/modules/comments/constants'

export type TranslationKeys =
  | CommonTranslationKeys
  | AuthTranslationKeys
  | UserTranslationKeys
  | FollowerTranslationKeys
  | CommentTranslationKeys
  | ValidationTranslationKeys
  | SuggestionTranslationKeys

export const TRANSLATION_KEYS = {
  ...CommonTranslationKeys,
  ...AuthTranslationKeys,
  ...UserTranslationKeys,
  ...FollowerTranslationKeys,
  ...CommentTranslationKeys,
  ...ValidationTranslationKeys,
  ...SuggestionTranslationKeys
} as const

