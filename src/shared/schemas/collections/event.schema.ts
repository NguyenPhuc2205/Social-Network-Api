/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/collections/event.schema.ts
 * @Description   : Event schema for Zod validation
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema,
  UpdatedAtSchema,
  ObjectIdArraySchema,
  StringArraySchema,
  IsPublicSchema,
  RequiresApprovalSchema,
  IsCancelledSchema
} from '~/shared/schemas/primitives'
import { GeoPointSchema } from '~/shared/schemas/primitives/geo-json.schema'

// Event validation schemas
export const EventBaseSchema = z.object({
  _id: ObjectIdSchema,
  creator_id: ObjectIdSchema,
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).default(''),
  location: GeoPointSchema.nullable().default(null),
  location_name: z.string().trim().max(200).nullable().default(null),
  location_address: z.string().trim().max(500).nullable().default(null),
  start_time: z.date(),
  end_time: z.date().nullable().default(null),
  timezone: z.string().default('UTC'),
  cover_photo: z.string().url().nullable().default(null),
  is_online: z.boolean().default(false),
  meeting_url: z.string().url().nullable().default(null),
  max_attendees: z.number().int().min(1).nullable().default(null),
  attendee_count: z.number().int().min(0).default(0),
  interested_count: z.number().int().min(0).default(0),
  is_public: IsPublicSchema.default(true),
  requires_approval: RequiresApprovalSchema.default(false),
  tags: StringArraySchema.default([]),
  category: z.string().trim().max(100).default(''),
  is_cancelled: IsCancelledSchema.default(false),
  cancelled_at: z.date().nullable().default(null),
  cancel_reason: z.string().trim().max(500).nullable().default(null),
  co_organizer_ids: ObjectIdArraySchema.default([]),
  
  created_at: CreatedAtSchema.default(() => new Date()),
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export const EventSchema = EventBaseSchema
  .refine((data) => {
    const typedData = data as any
    return !typedData.end_time || typedData.end_time > typedData.start_time
  }, {
    message: 'Event end time must be after start time',
    path: ['end_time']
  })
  .refine((data) => {
    const typedData = data as any
    return !typedData.max_attendees || typedData.attendee_count <= typedData.max_attendees
  }, {
    message: 'Attendee count cannot exceed maximum attendees',
    path: ['attendee_count']
  })

export const EventCreateSchema = EventBaseSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true
})

export const EventUpdateSchema = EventCreateSchema.partial().extend({
  _id: ObjectIdSchema,
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export type EventBaseType = z.infer<typeof EventBaseSchema>
export type EventType = z.infer<typeof EventSchema>
export type EventCreateType = z.infer<typeof EventCreateSchema>
export type EventUpdateType = z.infer<typeof EventUpdateSchema>
