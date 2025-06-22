/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/collections/comment.schema.ts
 * @Description   : Comment schema for Zod validation
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema,
  UpdatedAtSchema,
  ObjectIdArraySchema,
  IsDeletedSchema,
  DeletedAtSchema
} from '~/shared/schemas/primitives'
import { DeleteReasonSchema } from '~/shared/schemas/primitives/enum.schema'
import { MediaArraySchema } from '~/shared/schemas/primitives/media-related.schema'

// Comment validation schemas
export const CommentBaseSchema = z.object({
  _id: ObjectIdSchema,

  post_id: ObjectIdSchema,

  user_id: ObjectIdSchema,

  content: z.string().trim().min(1).max(2000),

  parent_id: ObjectIdSchema.nullable().default(null),

  mentions: ObjectIdArraySchema.max(50).default([]),  medias: z.array(z.any()).max(5).default([]),
  
  reaction_count: z.number().int().min(0).default(0),

  reaction_counts: z.record(z.string(), z.number().int().min(0)).default({}),

  reply_count: z.number().int().min(0).default(0),
  
  is_edited: z.boolean().default(false),

  edited_at: z.date().nullable().default(null),
  
  is_deleted: IsDeletedSchema.default(false),

  deleted_at: DeletedAtSchema.nullable().default(null),

  delete_reason: DeleteReasonSchema.nullable().default(null),
  
  created_at: CreatedAtSchema.default(() => new Date()),
  
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export const CommentSchema = CommentBaseSchema
  .refine((data) => {
    return (data as any).content.trim().length > 0
  }, {
    message: 'Comment content cannot be empty',
    path: ['content']
  })
  .refine((data) => {
    // A comment cannot be a reply to itself
    const typedData = data as any
    return !typedData.parent_id || !typedData._id || typedData.parent_id.toString() !== typedData._id.toString()
  }, {
    message: 'Comment cannot be a reply to itself',
    path: ['parent_id']
  })

export const CommentCreateSchema = CommentBaseSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true
})

export const CommentUpdateSchema = CommentCreateSchema.partial().extend({
  _id: ObjectIdSchema,
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export type CommentBaseType = z.infer<typeof CommentBaseSchema>
export type CommentType = z.infer<typeof CommentSchema>
export type CommentCreateType = z.infer<typeof CommentCreateSchema>
export type CommentUpdateType = z.infer<typeof CommentUpdateSchema>