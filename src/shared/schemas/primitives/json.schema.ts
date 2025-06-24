/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-20 23:33:30
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 01:55:52
 * @FilePath      : /server/src/shared/schemas/primitives/json.schema.ts
 * @Description   : JSON-related schema validations
 */

import { z } from 'zod'
import { ObjectIdSchema } from '~/shared/schemas/primitives/base.schema'
import { DateSchema } from '~/shared/schemas/primitives/dates.schema'
import { CountSchema } from '~/shared/schemas/primitives/numeric.schema'

// ===========================
// REACTION COUNTS
// ===========================
export const ReactionCountsSchema = z.object({
  Like: CountSchema,
  Love: CountSchema,
  Haha: CountSchema,
  Wow: CountSchema,
  Sad: CountSchema,
  Angry: CountSchema,
})

// ===========================
// NOTIFICATION PREFERENCES
// ===========================
export const NotificationPreferencesSchema = z.object({
  push: z.boolean(),
  email: z.boolean(),
  in_app: z.boolean(),
  mentions: z.boolean(),
  follows: z.boolean(),
  replies: z.boolean(),
  messages: z.boolean(),
  group_invites: z.boolean(),
  group_join_requests: z.boolean(),
  event_invites: z.boolean(),
  event_updates: z.boolean(),
  new_features: z.boolean(),
})

// ===========================
// PRIVACY SETTINGS
// ===========================
export const PrivacySettingsSchema = z.object({
  direct_message: z.enum(['everyone', 'followers_only', 'nobody']),
  tag_permission: z.enum(['everyone', 'followers_only', 'nobody']),
  discoverable_by_email: z.boolean(),
  discoverable_by_phone: z.boolean(),
})

// ===========================
// ACCESSIBILITY SETTINGS
// ===========================
export const AccessibilitySettingsSchema = z.object({
  font_size: z.enum(['small', 'medium', 'large', 'extra_large']),
  reduce_motion: z.boolean(),
  high_contrast: z.boolean(),
})

// ===========================
// CONTENT PREFERENCES
// ===========================
export const ContentPreferencesSchema = z.object({
  sensitive_content: z.boolean(),
  personalized_ads: z.boolean(),
  curated_timeline: z.boolean(),
})

// ===========================
// NICKNAMES
// ===========================
export const NicknamesSchema = z.array(
  z.object({
    user_id: ObjectIdSchema,
    nickname: z.string().trim().min(1).max(50),
  })
)

// ===========================
// READ BY
// ===========================
export const ReadBySchema = z.array(
  z.object({
    user_id: ObjectIdSchema,
    read_at: DateSchema,
  })
)

// ===========================
// POLL OPTIONS
// ===========================
export const PollOptionsSchema = z
  .array(
    z.object({
      text: z.string().trim().min(1).max(100),
      vote_count: CountSchema,
    })
  )
  .max(10)

// ===========================
// GROUP RULES
// ===========================
export const GroupRulesSchema = z.array(z.string().trim().min(1).max(500)).max(10)

// ===========================
// EVENT TAGS
// ===========================
export const EventTagsSchema = z.array(z.string().trim().min(1).max(30)).max(10)

// ===========================
// MEDIA DIMENSIONS
// ===========================
export const MediaDimensionsJsonSchema = z.object({
  width: z.number().int().min(1).max(10000),
  height: z.number().int().min(1).max(10000),
})

// ===========================
// TYPE EXPORTS
// ===========================
export type ReactionCountsType = z.infer<typeof ReactionCountsSchema>
export type NotificationPreferencesType = z.infer<typeof NotificationPreferencesSchema>
export type PrivacySettingsType = z.infer<typeof PrivacySettingsSchema>
export type AccessibilitySettingsType = z.infer<typeof AccessibilitySettingsSchema>
export type ContentPreferencesType = z.infer<typeof ContentPreferencesSchema>
export type NicknamesType = z.infer<typeof NicknamesSchema>
export type ReadByType = z.infer<typeof ReadBySchema>
export type PollOptionsType = z.infer<typeof PollOptionsSchema>
export type GroupRulesType = z.infer<typeof GroupRulesSchema>
export type EventTagsType = z.infer<typeof EventTagsSchema>
export type MediaDimensionsJsonType = z.infer<typeof MediaDimensionsJsonSchema>
