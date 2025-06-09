/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-27 23:23:28
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-05 00:46:47
 * @FilePath      : /server/src/shared/interfaces/index.ts
 * @Description   : Exports all shared interfaces
 */

export {
  IMediaDimensions,
  IReactionCounts,
  IPollOption
} from '~/shared/interfaces/content-related.interface'

export {
  IAccessibilitySettings,
  IContentPreferences,
  IGeoJsonPoint,
  ILoginHistory,
  INotificationPreferences,
  IPrivacySettings
} from '~/shared/interfaces/user-related.interface'

export {
  IConversationNickname
} from '~/shared/interfaces/interaction-related.interface'

export {
  IValidationOptions,
  IValidationErrorDetail,
  IFormattedValidationError
} from '~/shared/interfaces/zod-validator.interface'

export {
  IEnvLoadingOptions,
  IEnvLoadingResult,
} from '~/shared/interfaces/env-loader.interface'
