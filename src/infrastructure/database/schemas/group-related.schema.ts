/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-09 18:50:57
 * @FilePath      : /server/src/infrastructure/database/schemas/group-related.schema.ts
 * @Description   : Group-related schemas for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schemas'
import { 
  GroupMemberRole,
  GroupPrivacyType
} from '~/shared/enums'

/**
 * Group schema for managing user groups and communities
 * 
 * @interface IGroupSchema
 * @extends BaseSchema
 * @property {string} name - Name of the group
 * @property {string} description - Optional detailed description of the group
 * @property {string} avatar - Optional URL to group avatar image
 * @property {string} cover_photo - Optional URL to group cover photo
 * @property {GroupPrivacyType} privacy_type - Privacy setting (Public, Private, Secret)
 * @property {number} member_count - Current number of active group members
 * @property {number} post_count - Total number of posts in the group
 * @property {ObjectId} owner_id - ID of the group owner (must be in admin_ids)
 * @property {ObjectId[]} admin_ids - Array of admin user IDs (includes owner_id)
 * @property {string[]} rules - Optional array of group rules and guidelines
 * @property {string[]} tags - Optional array of tags for group categorization
 * @property {string} location - Optional human-readable location of the group
 * @property {boolean} is_active - Whether the group is currently active
 * @property {boolean} is_deleted - Whether the group has been soft deleted
 * @property {Date} deleted_at - Optional timestamp when group was deleted
 */
export interface IGroupSchema extends BaseSchema {
  /** Name of the group */
  name: string
  /** Optional detailed description of the group */
  description?: string
  /** Optional URL to group avatar image */
  avatar?: string
  /** Optional URL to group cover photo */
  cover_photo?: string
  /** Privacy setting (Public, Private, Secret) */
  privacy_type: GroupPrivacyType
  
  /** Current number of active group members */
  member_count: number
  /** Total number of posts in the group */
  post_count: number
  
  /** ID of the group owner (must be in admin_ids) */
  owner_id: ObjectId 
  /** Array of admin user IDs (includes owner_id) */
  admin_ids: ObjectId[]
  /** Optional array of group rules and guidelines */
  rules?: string[]
  /** Optional array of tags for group categorization */
  tags?: string[]
  /** Optional human-readable location of the group */
  location?: string
  
  /** Whether the group is currently active */
  is_active: boolean
  /** Whether the group has been soft deleted */
  is_deleted: boolean
  /** Optional timestamp when group was deleted */
  deleted_at?: Date
}

/**
 * Group member schema for tracking user membership in groups
 * 
 * @interface IGroupMemberSchema
 * @extends BaseSchema
 * @property {ObjectId} group_id - ID of the group
 * @property {ObjectId} user_id - ID of the member user
 * @property {GroupMemberRole} role - Member's role (Admin, Moderator, Member)
 * @property {ObjectId} invited_by - Optional ID of the user who invited this member
 * @property {boolean} is_active - Whether the membership is currently active
 * @property {Date} joined_at - Timestamp when user joined the group
 */
export interface IGroupMemberSchema extends BaseSchema {
  /** ID of the group */
  group_id: ObjectId
  /** ID of the member user */
  user_id: ObjectId
  /** Member's role (Admin, Moderator, Member) */
  role: GroupMemberRole
  /** Optional ID of the user who invited this member */
  invited_by?: ObjectId
  /** Whether the membership is currently active */
  is_active: boolean
  /** Timestamp when user joined the group */
  joined_at: Date
}

/**
 * Group post schema for managing posts within groups
 * 
 * @interface IGroupPostSchema
 * @extends BaseSchema
 * @property {ObjectId} group_id - ID of the group containing the post
 * @property {ObjectId} post_id - ID of the post
 * @property {boolean} is_pinned - Whether the post is pinned at the top of the group
 * @property {Date} pinned_at - Optional timestamp when post was pinned
 * @property {ObjectId} pinned_by - Optional ID of the admin/moderator who pinned the post
 */
export interface IGroupPostSchema extends BaseSchema {
  /** ID of the group containing the post */
  group_id: ObjectId
  /** ID of the post */
  post_id: ObjectId
  /** Whether the post is pinned at the top of the group */
  is_pinned: boolean
  /** Optional timestamp when post was pinned */
  pinned_at?: Date
  /** Optional ID of the admin/moderator who pinned the post */
  pinned_by?: ObjectId
}
