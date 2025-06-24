/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/post-hashtag.interface.ts
 * @Description   : Post-Hashtag interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'

/**
 * Post-Hashtag relationship interface
 * 
 * @interface IPostHashtag
 * @extends BaseSchema
 * @property {ObjectId} post_id - Post ID
 * @property {ObjectId} hashtag_id - Hashtag ID
 */
export interface IPostHashtag extends BaseSchema {
  /** Post ID */
  post_id: ObjectId
  /** Hashtag ID */
  hashtag_id: ObjectId
}
