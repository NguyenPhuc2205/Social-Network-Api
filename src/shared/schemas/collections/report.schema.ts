/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/collections/report.schema.ts
 * @Description   : Report schema for Zod validation
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema,
  UpdatedAtSchema,
  StringArraySchema
} from '~/shared/schemas/primitives'
import { 
  ReportReasonSchema,
  ReportStatusSchema 
} from '~/shared/schemas/primitives/enum.schema'

// Report validation schemas
export const ReportBaseSchema = z.object({
  _id: ObjectIdSchema,
  reporter_id: ObjectIdSchema,
  reported_user_id: ObjectIdSchema.nullable().default(null),
  reported_post_id: ObjectIdSchema.nullable().default(null),
  reported_comment_id: ObjectIdSchema.nullable().default(null),
  reported_message_id: ObjectIdSchema.nullable().default(null),
  reported_group_id: ObjectIdSchema.nullable().default(null),
  
  reason: ReportReasonSchema,
  description: z.string().trim().max(1000).default(''),
  evidence_urls: StringArraySchema.default([]),
  
  status: ReportStatusSchema.default('pending' as any),
  admin_notes: z.string().trim().max(2000).default(''),
  reviewer_id: ObjectIdSchema.nullable().default(null),
  reviewed_at: z.date().nullable().default(null),
  resolution: z.string().trim().max(1000).default(''),
  action_taken: z.string().trim().max(500).default(''),
  priority: z.number().int().min(1).max(5).default(3),
  category: z.string().trim().max(100).default(''),
  
  created_at: CreatedAtSchema.default(() => new Date()),
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export const ReportSchema = ReportBaseSchema
  .refine((data) => {
    const typedData = data as any
    // At least one target must be specified
    return typedData.reported_user_id || typedData.reported_post_id || 
           typedData.reported_comment_id || typedData.reported_message_id || 
           typedData.reported_group_id
  }, {
    message: 'At least one target (user, post, comment, message, or group) must be specified for the report',
    path: ['reported_user_id']
  })

export const ReportCreateSchema = ReportBaseSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true
})

export const ReportUpdateSchema = ReportCreateSchema.partial().extend({
  _id: ObjectIdSchema,
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export type ReportBaseType = z.infer<typeof ReportBaseSchema>
export type ReportType = z.infer<typeof ReportSchema>
export type ReportCreateType = z.infer<typeof ReportCreateSchema>
export type ReportUpdateType = z.infer<typeof ReportUpdateSchema>
