/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/collections/group-post.schema.ts
 * @Description   : Group post schema for Zod validation
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema,
  IsPinnedSchema
} from '~/shared/schemas/primitives'

// Group Post validation schemas
export const GroupPostBaseSchema = z.object({
  _id: ObjectIdSchema,
  group_id: ObjectIdSchema,
  post_id: ObjectIdSchema,
  is_pinned: IsPinnedSchema.default(false),
  pinned_at: z.date().nullable().default(null),
  pinned_by: ObjectIdSchema.nullable().default(null),
  
  created_at: CreatedAtSchema.default(() => new Date())
})

export const GroupPostSchema = GroupPostBaseSchema
  .refine((data) => {
    const typedData = data as any
    return typedData.group_id.toString() !== typedData.post_id.toString()
  }, {
    message: 'Group ID and Post ID must be different',
    path: ['post_id']
  })
  .refine((data) => {
    const typedData = data as any
    // If pinned, pinned_at and pinned_by should be provided
    return !typedData.is_pinned || (typedData.pinned_at && typedData.pinned_by)
  }, {
    message: 'Pinned posts must have pinned_at and pinned_by values',
    path: ['is_pinned']
  })

export const GroupPostCreateSchema = GroupPostBaseSchema.omit({
  _id: true,
  created_at: true
})

export const GroupPostUpdateSchema = GroupPostCreateSchema.partial().extend({
  _id: ObjectIdSchema
})

export type GroupPostBaseType = z.infer<typeof GroupPostBaseSchema>
export type GroupPostType = z.infer<typeof GroupPostSchema>
export type GroupPostCreateType = z.infer<typeof GroupPostCreateSchema>
export type GroupPostUpdateType = z.infer<typeof GroupPostUpdateSchema>
