/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 11:58:43
 * @FilePath      : /server/src/shared/enums/index.ts
 * @Description   : Exports all shared enums
 */

export {
  UserVerifyStatus,
  AccountType,
  AgeRestriction
} from '~/shared/enums/user-related.enum'

export {
  MediaType,
  PostAudience,
  PostType,
  ContentType,
  DeleteReason
} from '~/shared/enums/content-related.enum'

export {
  EventAttendeeStatus
} from '~/shared/enums/event-related.enum'

export {
  GroupMemberRole,
  GroupPrivacyType
} from '~/shared/enums/group-related.enum'

export {
  NotificationType,
  ReactionType
} from '~/shared/enums/interaction-related.enum'

export {
  ReportReason,
  ReportStatus
} from '~/shared/enums/report-related.enum'

export {
  TokenType
} from '~/shared/enums/token-types.enum'

export {
  PaymentStatus
} from '~/shared/enums/payment-related.enum'

export {
  SubscriptionStatus
} from '~/shared/enums/subscription-related.enum'

export {
  ProfileType
} from '~/shared/enums/profile-related.enum'

export { CommonTranslationKeys } from '~/shared/enums/common-translation.enum'
export { ValidationTranslationKeys } from '~/shared/enums/validation-translation.enum'
export { SuggestionTranslationKeys } from '~/shared/enums/suggestion-translation.enum'
