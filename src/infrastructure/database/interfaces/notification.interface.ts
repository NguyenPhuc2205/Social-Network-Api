/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-09 21:00:05
 * @FilePath      : /server/src/infrastructure/database/interfaces/notification.interface.ts
 * @Description   : Notification interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { NotificationType } from '~/shared/enums'

/**
 * Notification interface for managing user notifications
 * 
 * @interface INotification
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
export interface INotification extends BaseSchema {
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
