/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/post-category.interface.ts
 * @Description   : Post category interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'

/**
 * Post category interface for organizing posts
 * 
 * @interface IPostCategory
 * @extends BaseSchema
 * @property {string} name - Category name
 * @property {string} description - Optional category description
 * @property {string} icon - Optional URL to category icon or icon identifier
 * @property {ObjectId} parent_id - Optional parent category ID for nested categories
 */
export interface IPostCategory extends BaseSchema {
  /** Category name */
  name: string
  /** Category description */
  description?: string
  /** URL to category icon or icon identifier */
  icon?: string
  /** Parent category ID for nested categories */
  parent_id?: ObjectId
}
