/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 21:27:44
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 21:29:10
 * @FilePath      : /server/src/infrastructure/database/interfaces/message.interface.ts
 * @Description   : Message interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { IMedia } from '~/infrastructure/database/interfaces/media.interface'
import { DeleteReason } from '~/shared/enums'
import { IMessageReadBy } from '~/shared/interfaces/interaction-related.interface'

/**
 * Message interface for storing individual messages within conversations
 * 
 * @interface IMessage
 * @extends BaseSchema
 * @property {ObjectId} conversation_id - ID of the conversation containing this message
 * @property {ObjectId} sender_id - ID of the user who sent the message
 * @property {string} content - Optional message text content (max 4000 characters)
 * @property {IMedia[]} medias - Array of embedded media objects (max 10)
 * @property {ObjectId} reply_to_message_id - Optional ID of the message being replied to
 * @property {ObjectId[]} mentions - Array of mentioned user IDs (max 50)
 * @property {boolean} is_edited - Whether the message has been edited after sending
 * @property {Date} edited_at - Optional timestamp when message was last edited
 * @property {boolean} is_read - Whether the message has been read (deprecated, use read_by)
 * @property {IMessageReadBy[]} read_by - Array of users who have read the message with timestamps
 * @property {boolean} is_deleted - Whether the message has been soft deleted
 * @property {Date} deleted_at - Optional timestamp when message was deleted
 * @property {boolean} delete_for_everyone - Whether message was deleted for all participants
 * @property {DeleteReason} delete_reason - Optional reason for message deletion
 */
export interface IMessage extends BaseSchema {
  /** ID of the conversation containing this message */
  conversation_id: ObjectId
  /** ID of the user who sent the message */
  sender_id: ObjectId

  /** Optional message text content (max 4000 characters) */
  content?: string
  /** Array of embedded media objects (max 10) */
  medias: IMedia[]
  /** Optional ID of the message being replied to */
  reply_to_message_id?: ObjectId

  /** Array of mentioned user IDs (max 50) */
  mentions: ObjectId[]
  
  /** Whether the message has been edited after sending */
  is_edited: boolean
  /** Optional timestamp when message was last edited */
  edited_at?: Date

  /** Whether the message has been read (deprecated, use read_by) */
  is_read: boolean
  /** Array of users who have read the message with timestamps */
  read_by: IMessageReadBy[]

  /** Whether the message has been soft deleted */
  is_deleted: boolean
  /** Optional timestamp when message was deleted */
  deleted_at?: Date
  /** Whether message was deleted for all participants */
  delete_for_everyone: boolean
  /** Optional reason for message deletion */
  delete_reason?: DeleteReason
}
