/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/hashtag.interface.ts
 * @Description   : Hashtag interface for MongoDB Native Driver
 */

import { BaseSchema } from '~/core/bases/base.schema'

/**
 * Hashtag interface for storing hashtags
 * 
 * @interface IHashtag
 * @extends BaseSchema
 * @property {string} name - Unique hashtag name
 * @property {number} post_count - Number of posts using this hashtag
 */
export interface IHashtag extends BaseSchema {
  /** Unique hashtag name */
  name: string
  /** Number of posts using this hashtag */
  post_count: number
}
