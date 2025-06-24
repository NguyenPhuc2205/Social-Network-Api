/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-09 18:50:57
 * @FilePath      : /server/src/infrastructure/database/interfaces/group-post.interface.ts
 * @Description   : Group post interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'

/**
 * Group post interface for managing posts within groups
 * 
 * @interface IGroupPost
 * @extends BaseSchema
 * @property {ObjectId} group_id - ID of the group containing the post
 * @property {ObjectId} post_id - ID of the post
 * @property {boolean} is_pinned - Whether the post is pinned at the top of the group
 * @property {Date} pinned_at - Optional timestamp when post was pinned
 * @property {ObjectId} pinned_by - Optional ID of the admin/moderator who pinned the post
 */
export interface IGroupPost extends BaseSchema {
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
