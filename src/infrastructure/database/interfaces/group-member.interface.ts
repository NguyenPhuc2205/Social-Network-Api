/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-09 18:50:57
 * @FilePath      : /server/src/infrastructure/database/interfaces/group-member.interface.ts
 * @Description   : Group member interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { GroupMemberRole } from '~/shared/enums'

/**
 * Group member interface for tracking user membership in groups
 * 
 * @interface IGroupMember
 * @extends BaseSchema
 * @property {ObjectId} group_id - ID of the group
 * @property {ObjectId} user_id - ID of the member user
 * @property {GroupMemberRole} role - Member's role (Admin, Moderator, Member)
 * @property {ObjectId} invited_by - Optional ID of the user who invited this member
 * @property {boolean} is_active - Whether the membership is currently active
 * @property {Date} joined_at - Timestamp when user joined the group
 */
export interface IGroupMember extends BaseSchema {
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
