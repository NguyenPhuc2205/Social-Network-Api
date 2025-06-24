/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/collections/poll.schema.ts
 * @Description   : Poll schema for Zod validation
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema,
  UpdatedAtSchema
} from '~/shared/schemas/primitives'

// Poll option schema
const PollOptionSchema = z.object({
  text: z.string().trim().min(1).max(200),
  vote_count: z.number().int().min(0).default(0)
})

// Poll validation schemas
export const PollBaseSchema = z.object({
  _id: ObjectIdSchema,
  post_id: ObjectIdSchema,
  question: z.string().trim().min(1).max(500),
  options: z.array(PollOptionSchema).min(2).max(10),
  end_time: z.date().nullable().default(null),
  
  created_at: CreatedAtSchema.default(() => new Date()),
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export const PollSchema = PollBaseSchema
  .refine((data) => {
    const typedData = data as any
    return !typedData.end_time || typedData.end_time > new Date()
  }, {
    message: 'Poll end time must be in the future',
    path: ['end_time']
  })

export const PollCreateSchema = PollBaseSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true
})

export const PollUpdateSchema = PollCreateSchema.partial().extend({
  _id: ObjectIdSchema,
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export type PollOptionType = z.infer<typeof PollOptionSchema>
export type PollBaseType = z.infer<typeof PollBaseSchema>
export type PollType = z.infer<typeof PollSchema>
export type PollCreateType = z.infer<typeof PollCreateSchema>
export type PollUpdateType = z.infer<typeof PollUpdateSchema>
