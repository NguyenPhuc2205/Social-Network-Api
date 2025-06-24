/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 21:26:31
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 21:26:50
 * @FilePath      : /server/src/infrastructure/database/interfaces/conversation.interface.ts
 * @Description   : Conversation interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { DeleteReason } from '~/shared/enums'
import { IConversationNickname } from '~/shared/interfaces'

/**
 * Conversation interface for managing chat conversations between users
 * 
 * @interface IConversation
 * @extends BaseSchema
 * @property {ObjectId[]} participants - Array of user IDs participating in the conversation
 * @property {boolean} is_group - Whether this is a group conversation (more than 2 participants)
 * @property {string} group_name - Optional name for group conversations
 * @property {string} group_avatar - Optional URL to group avatar image
 * @property {IConversationNickname[]} nickname - Optional array of custom nicknames for participants
 * @property {string} theme - Optional conversation theme/color scheme
 * @property {string} last_message_content - Copy of the most recent message for quick access
 * @property {ObjectId} last_message_sender_id - ID of the user who sent the last message
 * @property {Date} last_message_time - Timestamp of the most recent message
 * @property {boolean} is_deleted - Whether the conversation has been soft deleted
 * @property {Date} deleted_at - Optional timestamp when conversation was deleted
 * @property {DeleteReason} delete_reason - Optional reason for conversation deletion
 */
export interface IConversation extends BaseSchema {
  /** Array of user IDs participating in the conversation */
  participants: ObjectId[]

  /** Whether this is a group conversation (more than 2 participants) */
  is_group: boolean
  /** Optional name for group conversations */
  group_name?: string
  /** Optional URL to group avatar image */
  group_avatar?: string

  /** Optional array of custom nicknames for participants */
  nicknames?: IConversationNickname[]

  /** Optional conversation theme/color scheme */
  theme?: string

  /** Copy of the most recent message for quick access */
  last_message_content?: string
  /** ID of the user who sent the last message */
  last_message_sender_id?: ObjectId
  /** Timestamp of the most recent message */
  last_message_time?: Date
  
  /** Whether the conversation has been soft deleted */
  is_deleted: boolean
  /** Optional timestamp when conversation was deleted */
  deleted_at?: Date
  /** Optional reason for conversation deletion */
  delete_reason?: DeleteReason
}