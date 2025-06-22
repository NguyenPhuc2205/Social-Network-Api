/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/post-post-category.interface.ts
 * @Description   : Post-PostCategory interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'

/**
 * Post-PostCategory relationship interface for many-to-many relationship between posts and categories
 * 
 * @interface IPostPostCategory
 * @extends BaseSchema
 * @property {ObjectId} post_id - Reference to the post
 * @property {ObjectId} category_id - Reference to the category
 */
export interface IPostPostCategory extends BaseSchema {
  /** Reference to the post */
  post_id: ObjectId
  /** Reference to the category */
  category_id: ObjectId
}
