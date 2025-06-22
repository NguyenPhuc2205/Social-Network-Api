/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/follower.interface.ts
 * @Description   : Follower interface for MongoDB Native Driver
 */
import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'

/**
 * Follower relationship interface for managing user follow relationships
 * 
 * @interface IFollower
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who is following
 * @property {ObjectId} followed_user_id - ID of the user being followed
 */
export interface IFollower extends BaseSchema {
  /** ID of the user who is following */
  user_id: ObjectId // User who follows
  /** ID of the user being followed */
  followed_user_id: ObjectId // User being followed
}
