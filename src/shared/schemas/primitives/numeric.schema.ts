/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-20 14:20:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-20 23:26:25
 * @FilePath      : /server/src/shared/schemas/primitives/numeric.schema.ts
 * @Description   : Numeric-related schema validations
 */

import { z } from 'zod'

// ===========================
// COUNTS
// ===========================
export const CountSchema = z.number().int().min(0)

export const PositiveIntSchema = z.number().int().min(1)

export const ZeroOrPositiveIntSchema = z.number().int().min(0)

// User related counts
export const FollowersCountSchema = z.number().int().min(0).max(1000000000)

export const FollowingCountSchema = z.number().int().min(0).max(1000000000)

export const PostCountSchema = z.number().int().min(0).max(1000000)

export const UnreadNotificationCountSchema = z.number().int().min(0).max(9999)

export const UnreadMessageCountSchema = z.number().int().min(0).max(9999)

export const CloseCircleCountSchema = z.number().int().min(0).max(150)

// Post related counts
export const GuestViewsSchema = z.number().int().min(0)

export const UserViewsSchema = z.number().int().min(0)

export const ReactionCountSchema = z.number().int().min(0)

export const ShareCountSchema = z.number().int().min(0)

export const CommentCountSchema = z.number().int().min(0)

export const BookmarkCountSchema = z.number().int().min(0)

// Group related counts
export const MemberCountSchema = z.number().int().min(0)

export const GroupPostCountSchema = z.number().int().min(0)

// Event related counts
export const AttendeeCountSchema = z.number().int().min(0)

export const InterestedCountSchema = z.number().int().min(0)

export const MaxAttendeesSchema = z.number().int().min(1).optional()

// Hashtag counts
export const HashtagPostCountSchema = z.number().int().min(0)

// ===========================
// RATINGS & SCORES
// ===========================
export const RatingSchema = z.number().min(0).max(5)

export const ScoreSchema = z.number().min(0)

export const TrendScoreSchema = z.number().min(0)

// ===========================
// PRICES & AMOUNTS
// ===========================
export const PriceSchema = z.number().min(0)

export const DecimalSchema = z.number().min(0).max(999999999.99)

export const PricePaidSchema = z.number().min(0)

export const AmountSchema = z.number().min(0)

export const RefundAmountSchema = z.number().min(0)

// ===========================
// INDICES & POSITIONS
// ===========================
export const IndexSchema = z.number().int().min(0)

export const OptionIndexSchema = z.number().int().min(0)

export const PrioritySchema = z.number().int().min(1).max(5).default(3)

// ===========================
// LIMITS & MAXIMA
// ===========================
export const MaxMentionsSchema = z.number().int().min(0).max(50)

export const MaxMediaItemsSchema = z.number().int().min(0).max(10)

export const MaxPollOptionsSchema = z.number().int().min(2).max(10)

export const MaxWebsitesSchema = z.number().int().min(0).max(3)

export const MaxRolesSchema = z.number().int().min(0).max(10)

export const MaxCloseCircleSchema = z.number().int().min(0).max(150)

export const MaxHashtagsSchema = z.number().int().min(0).max(10)

export const MaxCategoriesSchema = z.number().int().min(0).max(5)

export const MaxEvidenceUrlsSchema = z.number().int().min(0).max(10)

// ===========================
// AGES & TIME PERIODS
// ===========================
export const AgeSchema = z.number().int().min(0).max(120)

export const MinAgeSchema = z.number().int().min(13)

export const MaxAgeSchema = z.number().int().min(0).max(120)

// ===========================
// TYPE EXPORTS
// ===========================
export type CountType = z.infer<typeof CountSchema>
export type RatingType = z.infer<typeof RatingSchema>
export type PriceType = z.infer<typeof PriceSchema>
export type DecimalType = z.infer<typeof DecimalSchema>
