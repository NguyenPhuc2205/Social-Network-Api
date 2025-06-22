/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/comment.interface.ts
 * @Description   : Comment interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { DeleteReason } from '~/shared/enums'
import { IMedia } from '~/infrastructure/database/interfaces/media.interface'

/**
 * Comment interface for storing comments on posts
 * 
 * @interface IComment
 * @extends BaseSchema
 * @property {ObjectId} post_id - ID of the post that this comment belongs to
 * @property {ObjectId} user_id - ID of the user who created the comment
 * @property {string} content - Content of the comment (max 2000 characters)
 * @property {ObjectId} parent_id - Optional ID of parent comment for replies
 * @property {ObjectId[]} mentions - Array of user IDs mentioned in the comment (max 50)
 * @property {IMedia[]} medias - Array of media objects attached to the comment (max 5)
 * @property {number} reaction_count - Total number of reactions on this comment
 * @property {Record<string, number>} reaction_counts - Count of each reaction type
 * @property {number} reply_count - Number of replies to this comment
 * @property {boolean} is_edited - Whether the comment has been edited
 * @property {Date} edited_at - Optional timestamp when comment was last edited
 * @property {boolean} is_deleted - Whether the comment is soft deleted
 * @property {Date} deleted_at - Optional timestamp when comment was deleted
 * @property {DeleteReason} delete_reason - Optional reason for deletion
 */
export interface IComment extends BaseSchema {
  /** ID of the post that this comment belongs to */
  post_id: ObjectId
  /** ID of the user who created the comment */
  user_id: ObjectId
  /** Content of the comment (max 2000 characters) */
  content: string
  /** Optional ID of parent comment for replies */
  parent_id?: ObjectId | null
  /** Array of user IDs mentioned in the comment (max 50) */
  mentions: ObjectId[]
  /** Array of media objects attached to the comment (max 5) */
  medias: IMedia[]
  
  /** Total number of reactions on this comment */
  reaction_count: number
  /** Count of each reaction type */
  reaction_counts: Record<string, number>
  /** Number of replies to this comment */
  reply_count: number
  
  /** Whether the comment has been edited */
  is_edited: boolean
  /** Optional timestamp when comment was last edited */
  edited_at?: Date | null
  /** Whether the comment is soft deleted */
  is_deleted: boolean
  /** Optional timestamp when comment was deleted */
  deleted_at?: Date | null
  /** Optional reason for deletion */
  delete_reason?: DeleteReason | null
}
