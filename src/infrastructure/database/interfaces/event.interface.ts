/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 21:19:24
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 21:19:36
 * @FilePath      : /server/src/infrastructure/database/interfaces/event.interface.ts
 * @Description   : Event interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { IGeoJsonPoint } from '~/shared/interfaces'

/**
 * Event interface for managing social events and gatherings
 * 
 * @interface IEvent
 * @extends BaseSchema
 * @property {ObjectId} creator_id - ID of the user who created the event
 * @property {ObjectId[]} co_organizer_ids - Optional array of co-organizer user IDs
 * @property {string} title - Event title/name
 * @property {string} description - Optional detailed description of the event
 * @property {Date} start_time - Event start date and time
 * @property {Date} end_time - Optional event end date and time
 * @property {string} timezone - Timezone identifier (e.g., 'Asia/Ho_Chi_Minh')
 * @property {IGeoJsonPoint} location - Optional geographic coordinates of the event
 * @property {string} location_name - Optional human-readable location name
 * @property {string} location_address - Optional detailed street address
 * @property {string} cover_photo - Optional URL to event cover photo
 * @property {boolean} is_online - Whether the event is conducted online
 * @property {string} meeting_url - Optional URL for online meeting/stream
 * @property {number} max_attendees - Optional maximum number of attendees allowed
 * @property {number} attendee_count - Current number of confirmed attendees
 * @property {number} interested_count - Number of users marked as interested
 * @property {boolean} is_public - Whether the event is publicly visible
 * @property {boolean} requires_approval - Whether attendance requires organizer approval
 * @property {string[]} tags - Optional array of event tags for categorization
 * @property {string} category - Optional event category
 * @property {boolean} is_cancelled - Whether the event has been cancelled
 * @property {Date} cancelled_at - Optional timestamp when event was cancelled
 * @property {string} cancel_reason - Optional reason for event cancellation
 */
export interface IEvent extends BaseSchema {
  /** ID of the user who created the event */
  creator_id: ObjectId
  /** Optional array of co-organizer user IDs */
  co_organizer_ids?: ObjectId[]
  /** Event title/name */
  title: string
  /** Optional detailed description of the event */
  description?: string
  
  /** Event start date and time */
  start_time: Date
  /** Optional event end date and time */
  end_time?: Date
  /** Timezone identifier (e.g., 'Asia/Ho_Chi_Minh') */
  timezone: string
  
  /** Optional geographic coordinates of the event */
  location?: IGeoJsonPoint
  /** Optional human-readable location name */
  location_name?: string
  /** Optional detailed street address */
  location_address?: string
  
  /** Optional URL to event cover photo */
  cover_photo?: string
  
  /** Whether the event is conducted online */
  is_online: boolean
  /** Optional URL for online meeting/stream */
  meeting_url?: string
  
  /** Optional maximum number of attendees allowed */
  max_attendees?: number
  /** Current number of confirmed attendees */
  attendee_count: number
  /** Number of users marked as interested */
  interested_count: number
  
  /** Whether the event is publicly visible */
  is_public: boolean
  /** Whether attendance requires organizer approval */
  requires_approval: boolean
  
  /** Optional array of event tags for categorization */
  tags?: string[]
  /** Optional event category */
  category?: string
  
  /** Whether the event has been cancelled */
  is_cancelled: boolean
  /** Optional timestamp when event was cancelled */
  cancelled_at?: Date
  /** Optional reason for event cancellation */
  cancel_reason?: string
}