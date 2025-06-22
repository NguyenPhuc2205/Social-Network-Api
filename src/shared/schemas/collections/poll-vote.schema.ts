/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/collections/poll-vote.schema.ts
 * @Description   : Poll vote schema for Zod validation
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema
} from '~/shared/schemas/primitives'

// Poll Vote validation schemas
export const PollVoteBaseSchema = z.object({
  _id: ObjectIdSchema,
  poll_id: ObjectIdSchema,
  user_id: ObjectIdSchema,
  option_index: z.number().int().min(0).max(9),
  
  created_at: CreatedAtSchema.default(() => new Date())
})

export const PollVoteSchema = PollVoteBaseSchema
  .refine((data) => {
    const typedData = data as any
    return typedData.user_id.toString() !== '' && typedData.poll_id.toString() !== ''
  }, {
    message: 'User ID and Poll ID must be valid ObjectIds',
    path: ['user_id', 'poll_id']
  })

export const PollVoteCreateSchema = PollVoteBaseSchema.omit({
  _id: true,
  created_at: true
})

export const PollVoteUpdateSchema = PollVoteCreateSchema.partial().extend({
  _id: ObjectIdSchema
})

export type PollVoteBaseType = z.infer<typeof PollVoteBaseSchema>
export type PollVoteType = z.infer<typeof PollVoteSchema>
export type PollVoteCreateType = z.infer<typeof PollVoteCreateSchema>
export type PollVoteUpdateType = z.infer<typeof PollVoteUpdateSchema>
