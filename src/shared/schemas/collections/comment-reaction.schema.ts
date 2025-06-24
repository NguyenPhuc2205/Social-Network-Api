/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:43:52
 * @FilePath      : /server/src/shared/schemas/collections/comment-reaction.schema.ts
 * @Description   : Comment reaction schema for Zod validation
 */

import { z } from 'zod'
import { ReactionType } from '~/shared/enums'
import {
  ObjectIdSchema,
  CreatedAtSchema
} from '~/shared/schemas/primitives'
import { ReactionTypeSchema } from '~/shared/schemas/primitives/enum.schema'

// Comment Reaction validation schemas
export const CommentReactionBaseSchema = z.object({
  _id: ObjectIdSchema,

  user_id: ObjectIdSchema,
  
  comment_id: ObjectIdSchema,
  
  type: ReactionTypeSchema.default(ReactionType.Like),
  
  created_at: CreatedAtSchema.default(() => new Date())
})

export const CommentReactionSchema = CommentReactionBaseSchema
  .refine((data) => {
    const typedData = data as any
    return typedData.user_id.toString() !== '' && typedData.comment_id.toString() !== ''
  }, {
    message: 'User ID and Comment ID must be valid ObjectIds',
    path: ['user_id', 'comment_id']
  })

export const CommentReactionCreateSchema = CommentReactionBaseSchema.omit({
  _id: true,
  created_at: true
})

export const CommentReactionUpdateSchema = CommentReactionCreateSchema.partial().extend({
  _id: ObjectIdSchema
})

export type CommentReactionBaseType = z.infer<typeof CommentReactionBaseSchema>
export type CommentReactionType = z.infer<typeof CommentReactionSchema>
export type CommentReactionCreateType = z.infer<typeof CommentReactionCreateSchema>
export type CommentReactionUpdateType = z.infer<typeof CommentReactionUpdateSchema>
