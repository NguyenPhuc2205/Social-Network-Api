/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/poll.interface.ts
 * @Description   : Poll interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { IPollOption } from '~/shared/interfaces'

/**
 * Poll interface for storing poll data attached to posts
 * 
 * @interface IPoll
 * @extends BaseSchema
 * @property {ObjectId} post_id - ID of the post that contains this poll
 * @property {string} question - The poll question text
 * @property {IPollOption[]} options - Array of poll options with text and vote count (max 10)
 * @property {Date} end_time - Optional expiration time for the poll
 */
export interface IPoll extends BaseSchema {
  /** ID of the post that contains this poll */
  post_id: ObjectId
  /** The poll question text */
  question: string
  /** Array of poll options with text and vote count (max 10) */
  options: IPollOption[]
  /** Optional expiration time for the poll */
  end_time?: Date
}
