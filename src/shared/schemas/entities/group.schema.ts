/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 01:25:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 10:46:03
 * @FilePath      : /server/src/shared/schemas/entities/group.schema.ts
 * @Description   : Group schema validation for group entity
 */

import { z } from 'zod'
import { GroupPrivacyType } from '~/shared/enums'
import {
  ObjectIdSchema,
  ObjectIdArraySchema,
  GroupNameSchema,
  DescriptionSchema,
  AvatarURLSchema,
  CoverPhotoURLSchema,
  GroupPrivacyTypeSchema,
  MemberCountSchema,
  GroupPostCountSchema,
  GroupRulesSchema,
  TagArraySchema,
  LocationStringSchema,
  IsActiveSchema,
  IsDeletedSchema,
  DeletedAtSchema,
  CreatedAtSchema,
  UpdatedAtSchema
} from '~/shared/schemas/primitives'

export const GroupBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** Name of the group */
  name: GroupNameSchema,

  /** Optional detailed description of the group */
  description: DescriptionSchema.default(''),

  /** Optional URL to group avatar image */
  avatar: AvatarURLSchema.nullable().default(null),

  /** Optional URL to group cover photo */
  cover_photo: CoverPhotoURLSchema.nullable().default(null),

  /** Privacy setting (Public, Private, Secret) */
  privacy_type: GroupPrivacyTypeSchema.default(GroupPrivacyType.Public),

  /** Current number of active group members */
  member_count: MemberCountSchema.default(0),

  /** Total number of posts in the group */
  post_count: GroupPostCountSchema.default(0),

  /** ID of the group owner (must be in admin_ids) */
  owner_id: ObjectIdSchema,

  /** Array of admin user IDs (includes owner_id) */
  admin_ids: ObjectIdArraySchema.min(1),

  /** Optional array of group rules and guidelines */
  rules: GroupRulesSchema.default([]),

  /** Optional array of tags for group categorization */
  tags: TagArraySchema.default([]),

  /** Optional human-readable location of the group */
  location: LocationStringSchema.nullable().default(null),

  /** Whether the group is currently active */
  is_active: IsActiveSchema.default(true),

  /** Whether the group is soft deleted */
  is_deleted: IsDeletedSchema.default(false),

  /** Timestamp when group was soft deleted */
  deleted_at: DeletedAtSchema.nullable().default(null),

  // Timestamps
  created_at: CreatedAtSchema.default(() => new Date()),

  updated_at: UpdatedAtSchema.default(() => new Date())
})

export const GroupSchema = GroupBaseSchema
  .refine((data) => {
    return data.admin_ids.includes(data.owner_id)
  }, { path: ['admin_ids'] })
  .refine((data) => {
    return !data.is_deleted || data.deleted_at
  }, { path: ['is_deleted'] })
  .refine((data) => {
    return data.is_deleted || !data.deleted_at
  }, { path: ['is_deleted'] })

export const GroupCreateSchema = GroupBaseSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true
})

export const GroupUpdateSchema = GroupCreateSchema.partial().extend({
  _id: ObjectIdSchema,
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export type GroupType = z.infer<typeof GroupSchema>
export type GroupCreateType = z.infer<typeof GroupCreateSchema>
export type GroupUpdateType = z.infer<typeof GroupUpdateSchema>
