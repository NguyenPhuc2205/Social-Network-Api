/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/reaction.interface.ts
 * @Description   : Reaction interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { ReactionType } from '~/shared/enums'

/**
 * Reaction interface for storing user reactions to posts
 * 
 * @interface IReaction
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who reacted
 * @property {ObjectId} post_id - ID of the post that was reacted to
 * @property {ReactionType} type - Type of reaction (Like, Love, Haha, Wow, Sad, Angry)
 */
export interface IReaction extends BaseSchema {
  /** ID of the user who reacted */
  user_id: ObjectId
  /** ID of the post that was reacted to */
  post_id: ObjectId
  /** Type of reaction (Like, Love, Haha, Wow, Sad, Angry) */
  type: ReactionType
}
