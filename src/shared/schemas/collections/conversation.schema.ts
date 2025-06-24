/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 01:15:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 10:12:46
 * @FilePath      : /server/src/shared/schemas/entities/conversation.schema.ts
 * @Description   : Conversation schema validation for conversation entity
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  ObjectIdArraySchema,
  GroupNameSchema,
  AvatarURLSchema,
  ThemeSchema,
  NicknamesSchema,
  MessageContentSchema,
  LastMessageTimeSchema,
  IsDeletedSchema,
  DeletedAtSchema,
  DeleteReasonSchema,
  CreatedAtSchema,
  UpdatedAtSchema
} from '~/shared/schemas/primitives'

export const ConversationBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** Array of participant user IDs */
  participants: ObjectIdArraySchema.min(2).max(100),

  /** Whether this is a group conversation (more than 2 participants) */
  is_group: z.boolean().default(false),

  /** Optional name for group conversations */
  group_name: GroupNameSchema.nullable().default(null),

  /** Optional avatar for group conversations */
  group_avatar: AvatarURLSchema.nullable().default(null),

  /** Custom nicknames for participants */
  nicknames: NicknamesSchema.default([]),

  /** Theme setting for the conversation */
  theme: ThemeSchema.default('light'),

  /** Copy of the most recent message content for quick access */
  last_message_content: MessageContentSchema.default(''),

  /** Sender of the last message */
  last_message_sender_id: ObjectIdSchema.nullable().default(null),

  /** Timestamp of the last message */
  last_message_time: LastMessageTimeSchema.nullable().default(null),

  /** Whether the conversation is soft deleted */
  is_deleted: IsDeletedSchema.default(false),

  /** Timestamp when conversation was deleted */
  deleted_at: DeletedAtSchema.nullable().default(null),

  /** Reason for deletion */
  delete_reason: DeleteReasonSchema.nullable().default(null),

  // Timestamps
  created_at: CreatedAtSchema.default(() => new Date()),

  updated_at: UpdatedAtSchema.default(() => new Date())
})

export const ConversationSchema = ConversationBaseSchema
  .refine((data) => {
    return data.is_group === (data.participants.length > 2)
  }, { path: ['is_group'] })
  .refine((data) => {
    return !data.is_deleted || (data.deleted_at && data.delete_reason)
  }, { path: ['is_deleted'] })
  .refine((data) => {
    return data.is_deleted || (!data.deleted_at && !data.delete_reason)
  }, { path: ['is_deleted'] })

export const ConversationCreateSchema = ConversationBaseSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true
})

export const ConversationUpdateSchema = ConversationCreateSchema.partial().extend({
  _id: ObjectIdSchema,
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export type ConversationType = z.infer<typeof ConversationSchema>
export type ConversationCreateType = z.infer<typeof ConversationCreateSchema>
export type ConversationUpdateType = z.infer<typeof ConversationUpdateSchema>
