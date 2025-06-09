/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-09 21:00:05
 * @FilePath      : /server/src/infrastructure/database/schemas/interaction-related.schema.ts
 * @Description   : Interaction-related schemas for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schemas'
import { IMediaSchema } from '~/infrastructure/database/schemas/content-related.schema'
import { 
  DeleteReason,
  NotificationType
} from '~/shared/enums'
import { IConversationNickname } from '~/shared/interfaces'
import { IMessageReadBy } from '~/shared/interfaces/interaction-related.interface'

/**
 * Notification schema for managing user notifications
 * 
 * @interface INotificationSchema
 * @extends BaseSchema
 * @property {ObjectId} recipient_id - ID of the user receiving the notification
 * @property {ObjectId} sender_id - Optional ID of the user who triggered the notification
 * @property {NotificationType} type - Type of notification (Like, Share, Follow, Comment, etc.)
 * @property {string} title - Short title text for the notification
 * @property {string} message - Detailed message content for the notification
 * @property {ObjectId} post_id - Optional post ID for post-related notifications
 * @property {ObjectId} conversation_id - Optional conversation ID for message notifications
 * @property {ObjectId} group_id - Optional group ID for group-related notifications
 * @property {ObjectId} event_id - Optional event ID for event-related notifications
 * @property {boolean} is_read - Whether the notification has been read by the recipient
 * @property {Date} read_at - Optional timestamp when notification was marked as read
 */
export interface INotificationSchema extends BaseSchema {
  /** ID of the user receiving the notification */
  recipient_id: ObjectId
  /** Optional ID of the user who triggered the notification */
  sender_id?: ObjectId
  /** Type of notification (Like, Share, Follow, Comment, etc.) */
  type: NotificationType

  /** Short title text for the notification */
  title: string
  /** Detailed message content for the notification */
  message: string
  
  /** Optional post ID for post-related notifications */
  post_id?: ObjectId
  /** Optional conversation ID for message notifications */
  conversation_id?: ObjectId
  /** Optional group ID for group-related notifications */
  group_id?: ObjectId
  /** Optional event ID for event-related notifications */
  event_id?: ObjectId
  
  /** Whether the notification has been read by the recipient */
  is_read: boolean
  /** Optional timestamp when notification was marked as read */
  read_at?: Date
}

/**
 * Conversation schema for managing chat conversations between users
 * 
 * @interface IConversationSchema
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
export interface IConversationSchema extends BaseSchema {
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

/**
 * Message schema for storing individual messages within conversations
 * 
 * @interface IMessageSchema
 * @extends BaseSchema
 * @property {ObjectId} conversation_id - ID of the conversation containing this message
 * @property {ObjectId} sender_id - ID of the user who sent the message
 * @property {string} content - Optional message text content (max 4000 characters)
 * @property {IMediaSchema[]} medias - Array of embedded media objects (max 10)
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
export interface IMessageSchema extends BaseSchema {
  /** ID of the conversation containing this message */
  conversation_id: ObjectId
  /** ID of the user who sent the message */
  sender_id: ObjectId

  /** Optional message text content (max 4000 characters) */
  content?: string
  /** Array of embedded media objects (max 10) */
  medias: IMediaSchema[]
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
