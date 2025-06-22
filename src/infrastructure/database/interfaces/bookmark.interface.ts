/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/bookmark.interface.ts
 * @Description   : Bookmark interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'

/**
 * Bookmark interface for storing user bookmarks of posts
 * 
 * @interface IBookmark
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who bookmarked the post
 * @property {ObjectId} post_id - ID of the post that was bookmarked
 */
export interface IBookmark extends BaseSchema {
  /** ID of the user who bookmarked the post */
  user_id: ObjectId
  /** ID of the post that was bookmarked */
  post_id: ObjectId
}
