/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-20 14:00:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 01:29:50
 * @FilePath      : /server/src/shared/schemas/primitives/text.schema.ts
 * @Description   : Text-related schema validations
 */

import { z } from 'zod'

// ===========================
// NAMES & IDENTIFIERS
// ===========================
export const NameSchema = z.string()
  .trim()
  .min(1)
  .max(100)

export const UsernameSchema = z.string()
  .trim()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9_]+$/) // Alphanumeric (letters, numbers) and underscore only

export const DisplayNameSchema = z.string()
  .trim()
  .min(1)
  .max(50)

export const GroupNameSchema = z.string()
  .trim()
  .min(1)
  .max(100)

export const EventTitleSchema = z.string()
  .trim()
  .min(1)
  .max(200)

export const CategoryNameSchema = z.string()
  .trim()
  .min(1)
  .max(100)

export const RoleNameSchema = z.string()
  .trim()
  .min(1)
  .max(50)

export const PermissionNameSchema = z.string()
  .trim()
  .min(1)
  .max(100)

export const TrendNameSchema = z.string()
  .trim()
  .min(1)
  .max(100)

// ===========================
// CONTENT & DESCRIPTIONS
// ===========================
export const BioSchema = z.string().trim().max(500)

export const DescriptionSchema = z.string().trim().max(1000)

export const ShortDescriptionSchema = z.string().trim().max(200)

export const LongDescriptionSchema = z.string().trim().max(5000)

export const ContentShortSchema = z.string().trim().max(500)

export const ContentLongSchema = z.string().trim().max(5000)

export const ContentSchema = z.string().trim().max(5000)

export const MessageContentSchema = z.string().trim().max(4000)

export const CommentContentSchema = z.string().trim().max(1000)

export const ReportDescriptionSchema = z.string().trim().max(1000)

export const AdminNotesSchema = z.string().trim().max(1000)

export const ResolutionSchema = z.string().trim().max(500)

export const ActionTakenSchema = z.string().trim().max(500)

// ===========================
// TITLES & HEADINGS
// ===========================
export const TitleSchema = z.string().trim().min(1).max(200)

export const SubtitleSchema = z.string().trim().max(100)

export const NotificationTitleSchema = z.string().trim().min(1).max(100)

export const PollQuestionSchema = z.string().trim().min(1).max(500)

// ===========================
// HASHTAGS & TAGS
// ===========================
export const HashtagSchema = z.string()
  .trim()
  .min(1)
  .max(50)
  .regex(/^[a-zA-Z0-9_]+$/)

export const TagSchema = z.string().trim().min(1).max(30)

export const HashtagArraySchema = z.array(HashtagSchema).max(10)

export const TagArraySchema = z.array(TagSchema).max(20)

export const CategoryTagsSchema = z.array(z.string().trim().max(50)).max(10)

// ===========================
// SEARCH & FILTERING
// ===========================
export const SearchQuerySchema = z.string().trim().min(1).max(100)

export const SearchKeywordSchema = z.string().trim().min(1).max(50)

// ===========================
// NOTIFICATIONS & MESSAGES
// ===========================
export const NotificationMessageSchema = z.string().trim().min(1).max(500)

export const SystemMessageSchema = z.string().trim().max(1000)

// ===========================
// REASON & NOTES
// ===========================
export const ReasonSchema = z.string().trim().max(500)

export const NotesSchema = z.string().trim().max(1000)

export const CancelReasonSchema = z.string().trim().max(500)

export const FailureReasonSchema = z.string().trim().max(500)

export const RefundReasonSchema = z.string().trim().max(500)

// ===========================
// PAYMENT & SUBSCRIPTION
// ===========================
export const CurrencySchema = z.string().trim().length(3).regex(/^[A-Z]{3}$/) // ISO 4217 currency code, e.g., USD, VND

export const BillingCycleSchema = z.enum(['monthly', 'yearly', 'lifetime'])

export const PaymentMethodSchema = z.string().trim().min(1).max(50) // e.g., stripe, paypal

export const TransactionIdSchema = z.string().trim().min(1).max(100)

// ===========================
// USER PREFERENCES
// ===========================
export const ThemeSchema = z.enum(['light', 'dark', 'system'])

export const LanguageSchema = z.string().trim().length(2).regex(/^[a-z]{2}$/) // ISO 639-1 language code, e.g., en, vi

// ===========================
// EVENT & REPORT
// ===========================
export const EventCategorySchema = z.string().trim().min(1).max(100)

export const ReportCategorySchema = z.string().trim().min(1).max(100)

// ===========================
// TYPE EXPORTS
// ===========================
export type NameType = z.infer<typeof NameSchema>
export type UsernameType = z.infer<typeof UsernameSchema>
export type BioType = z.infer<typeof BioSchema>
export type ContentType = z.infer<typeof ContentSchema>
export type TitleType = z.infer<typeof TitleSchema>
export type HashtagType = z.infer<typeof HashtagSchema>
export type DescriptionType = z.infer<typeof DescriptionSchema>
export type CurrencyType = z.infer<typeof CurrencySchema>
export type BillingCycleType = z.infer<typeof BillingCycleSchema>
export type ThemeType = z.infer<typeof ThemeSchema>
export type LanguageType = z.infer<typeof LanguageSchema>
