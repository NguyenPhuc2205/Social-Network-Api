/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/collections/event-attendee.schema.ts
 * @Description   : Event attendee schema for Zod validation
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema
} from '~/shared/schemas/primitives'
import { EventAttendeeStatusSchema } from '~/shared/schemas/primitives/enum.schema'

// Event Attendee validation schemas
export const EventAttendeeBaseSchema = z.object({
  _id: ObjectIdSchema,
  event_id: ObjectIdSchema,
  user_id: ObjectIdSchema,
  status: EventAttendeeStatusSchema,
  invited_by: ObjectIdSchema.nullable().default(null),
  check_in_at: z.date().nullable().default(null),
  joined_at: z.date().default(() => new Date()),
  
  created_at: CreatedAtSchema.default(() => new Date())
})

export const EventAttendeeSchema = EventAttendeeBaseSchema
  .refine((data) => {
    const typedData = data as any
    return typedData.event_id.toString() !== typedData.user_id.toString()
  }, {
    message: 'Event ID and User ID must be different',
    path: ['user_id']
  })

export const EventAttendeeCreateSchema = EventAttendeeBaseSchema.omit({
  _id: true,
  created_at: true
})

export const EventAttendeeUpdateSchema = EventAttendeeCreateSchema.partial().extend({
  _id: ObjectIdSchema
})

export type EventAttendeeBaseType = z.infer<typeof EventAttendeeBaseSchema>
export type EventAttendeeType = z.infer<typeof EventAttendeeSchema>
export type EventAttendeeCreateType = z.infer<typeof EventAttendeeCreateSchema>
export type EventAttendeeUpdateType = z.infer<typeof EventAttendeeUpdateSchema>
