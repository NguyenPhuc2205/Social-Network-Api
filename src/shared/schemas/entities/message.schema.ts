/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 01:20:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 01:20:00
 * @FilePath      : /server/src/shared/schemas/entities/message.schema.ts
 * @Description   : Message schema validation for message entity
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  ObjectIdArraySchema,
  MessageContentSchema,
  MediaArraySchema,
  IsEditedSchema,
  EditedAtSchema,
  IsReadSchema,
  ReadBySchema,
  IsDeletedSchema,
  DeletedAtSchema,
  DeleteForEveryoneSchema,
  DeleteReasonSchema,
  CreatedAtSchema,
  UpdatedAtSchema
} from '~/shared/schemas/primitives'

export const MessageBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** ID of the conversation this message belongs to */
  conversation_id: ObjectIdSchema,

  /** ID of the user who sent the message */
  sender_id: ObjectIdSchema,

  /** Message content text (max 4000 characters) */
  content: MessageContentSchema.default(''),

  /** Array of embedded media objects (max 10) */
  medias: MediaArraySchema.default([]),

  /** Optional ID of message being replied to */
  reply_to_message_id: ObjectIdSchema.nullable().default(null),

  /** Array of mentioned user IDs (max 50) */
  mentions: ObjectIdArraySchema.max(50).default([]),

  /** Whether the message has been edited */
  is_edited: IsEditedSchema.default(false),

  /** Timestamp when message was edited */
  edited_at: EditedAtSchema.nullable().default(null),

  /** Whether the message has been read */
  is_read: IsReadSchema.default(false),

  /** Array of read status by participants */
  read_by: ReadBySchema.default([]),

  /** Whether the message is soft deleted */
  is_deleted: IsDeletedSchema.default(false),

  /** Timestamp when message was deleted */
  deleted_at: DeletedAtSchema.nullable().default(null),

  /** Whether message was deleted for all participants */
  delete_for_everyone: DeleteForEveryoneSchema.default(false),

  /** Reason for deletion */
  delete_reason: DeleteReasonSchema.nullable().default(null),

  // Timestamps
  created_at: CreatedAtSchema.default(() => new Date()),

  updated_at: UpdatedAtSchema.default(() => new Date())
})

export const MessageSchema = MessageBaseSchema
  .refine((data) => {
    return !data.is_edited || data.edited_at
  }, { path: ['edited_at'] })
  .refine((data) => {
    return data.is_edited || !data.edited_at
  }, { path: ['edited_at'] })
  .refine((data) => {
    return !data.is_deleted || (data.deleted_at && data.delete_reason)
  }, { path: ['is_deleted'] })
  .refine((data) => {
    return data.is_deleted || (!data.deleted_at && !data.delete_reason)
  }, { path: ['is_deleted'] })

export const MessageCreateSchema = MessageBaseSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true
})

export const MessageUpdateSchema = MessageCreateSchema.partial().extend({
  _id: ObjectIdSchema,
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export type MessageType = z.infer<typeof MessageSchema>
export type MessageCreateType = z.infer<typeof MessageCreateSchema>
export type MessageUpdateType = z.infer<typeof MessageUpdateSchema>
