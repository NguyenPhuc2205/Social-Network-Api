/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 21:22:34
 * @FilePath      : /server/src/infrastructure/database/interfaces/group.interface.ts
 * @Description   : Group interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { GroupPrivacyType } from '~/shared/enums'

/**
 * Group interface for managing user groups and communities
 * 
 * @interface IGroup
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
export interface IGroup extends BaseSchema {
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
