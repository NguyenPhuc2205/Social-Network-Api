/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 21:20:36
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 21:20:39
 * @FilePath      : /server/src/infrastructure/database/interfaces/event-attendee.interface.ts
 * @Description   : Event attendee interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { EventAttendeeStatus } from '~/shared/enums'

/**
 * Event attendee interface for tracking user participation in events
 * 
 * @interface IEventAttendee
 * @extends BaseSchema
 * @property {ObjectId} event_id - ID of the event
 * @property {ObjectId} user_id - ID of the attending user
 * @property {EventAttendeeStatus} status - Attendance status (Going, Interested, NotGoing)
 * @property {ObjectId} invited_by - Optional ID of the user who sent the invitation
 * @property {Date} check_in_at - Optional timestamp when user checked in at the event
 * @property {Date} joined_at - Timestamp when user joined/responded to the event
 */
export interface IEventAttendee extends BaseSchema {
  /** ID of the event */
  event_id: ObjectId
  /** ID of the attending user */
  user_id: ObjectId
  /** Attendance status (Going, Interested, NotGoing) */
  status: EventAttendeeStatus
  /** Optional ID of the user who sent the invitation */
  invited_by?: ObjectId
  /** Optional timestamp when user checked in at the event */
  check_in_at?: Date
  /** Timestamp when user joined/responded to the event */
  joined_at: Date
}