/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/collections/group-member.schema.ts
 * @Description   : Group member schema for Zod validation
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema,
  IsActiveSchema
} from '~/shared/schemas/primitives'
import { GroupMemberRoleSchema } from '~/shared/schemas/primitives/enum.schema'

// Group Member validation schemas
export const GroupMemberBaseSchema = z.object({
  _id: ObjectIdSchema,
  group_id: ObjectIdSchema,
  user_id: ObjectIdSchema,
  role: GroupMemberRoleSchema,
  invited_by: ObjectIdSchema.nullable().default(null),
  is_active: IsActiveSchema.default(true),
  joined_at: z.date().default(() => new Date()),
  
  created_at: CreatedAtSchema.default(() => new Date())
})

export const GroupMemberSchema = GroupMemberBaseSchema
  .refine((data) => {
    const typedData = data as any
    return typedData.group_id.toString() !== typedData.user_id.toString()
  }, {
    message: 'Group ID and User ID must be different',
    path: ['user_id']
  })

export const GroupMemberCreateSchema = GroupMemberBaseSchema.omit({
  _id: true,
  created_at: true
})

export const GroupMemberUpdateSchema = GroupMemberCreateSchema.partial().extend({
  _id: ObjectIdSchema
})

export type GroupMemberBaseType = z.infer<typeof GroupMemberBaseSchema>
export type GroupMemberType = z.infer<typeof GroupMemberSchema>
export type GroupMemberCreateType = z.infer<typeof GroupMemberCreateSchema>
export type GroupMemberUpdateType = z.infer<typeof GroupMemberUpdateSchema>
