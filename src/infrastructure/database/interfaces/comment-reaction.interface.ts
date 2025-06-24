/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/comment-reaction.interface.ts
 * @Description   : Comment reaction interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { ReactionType } from '~/shared/enums'

/**
 * Comment reaction interface for storing user reactions to comments
 * 
 * @interface ICommentReaction
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who reacted
 * @property {ObjectId} comment_id - ID of the comment that was reacted to
 * @property {ReactionType} type - Type of reaction (Like, Love, Haha, Wow, Sad, Angry)
 */
export interface ICommentReaction extends BaseSchema {
  /** ID of the user who reacted */
  user_id: ObjectId
  /** ID of the comment that was reacted to */
  comment_id: ObjectId
  /** Type of reaction (Like, Love, Haha, Wow, Sad, Angry) */
  type: ReactionType
}
