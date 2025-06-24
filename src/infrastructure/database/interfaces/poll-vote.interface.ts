/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/poll-vote.interface.ts
 * @Description   : Poll vote interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'

/**
 * Poll vote interface for tracking individual user votes on polls
 * 
 * @interface IPollVote
 * @extends BaseSchema
 * @property {ObjectId} poll_id - ID of the poll being voted on
 * @property {ObjectId} user_id - ID of the user who voted
 * @property {number} option_index - Index of the selected option in the poll's options array
 */
export interface IPollVote extends BaseSchema {
  /** ID of the poll being voted on */
  poll_id: ObjectId
  /** ID of the user who voted */
  user_id: ObjectId
  /** Index of the selected option in the poll's options array */
  option_index: number
}
