/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-20 13:52:10
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 10:32:56
 * @FilePath      : /server/src/shared/schemas/primitives/base.schema.ts
 * @Description   : Base schema for all primitives used in the application.
 */

import { ObjectId } from 'mongodb'
import { z } from 'zod'

// ===========================
// BASIC TYPES
// ===========================
/** z.instance(ObjectId) */
export const ObjectIdSchema = z.instanceof(ObjectId)

export const OptionalObjectIdSchema = ObjectIdSchema.optional()

export const NullableObjectIdSchema = ObjectIdSchema.nullable()

export const OptionalNullableObjectIdSchema = ObjectIdSchema.optional().nullable()

// ===========================
// TIMESTAMPS
// ===========================
export const TimestampSchema = z.date()

export const OptionalTimestampSchema = TimestampSchema.optional()

export const NullableTimestampSchema = TimestampSchema.nullable()

export const OptionalNullableTimestampSchema = TimestampSchema.optional().nullable()

export const CreatedAtSchema = TimestampSchema

export const UpdatedAtSchema = TimestampSchema

// ===========================
// PAGINATION
// ===========================
export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc'])
})

export const PaginationResponseSchema = z.object({
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  totalPages: z.number().int().min(1),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
})

// ===========================
// SOFT DELETE
// ===========================
export const IsDeletedSchema = z.boolean()

export const DeletedAtSchema = z.date()

export const OptionalDeletedAtSchema = DeletedAtSchema.optional()

export const NullableDeletedAtSchema = DeletedAtSchema.nullable()

export const OptionalNullableDeletedAtSchema = DeletedAtSchema.optional().nullable()

export const DeleteForEveryoneSchema = z.boolean().default(false)

// ===========================
// ARRAYS
// ===========================
export const ObjectIdArraySchema = z.array(ObjectIdSchema)

export const StringArraySchema = z.array(z.string())

export const NumberArraySchema = z.array(z.number())

// ===========================
// STATUS FLAGS
// ===========================
export const BooleanSchema = z.boolean()

export const IsPrivateSchema = BooleanSchema

export const IsActiveSchema = BooleanSchema

export const IsPinnedSchema = BooleanSchema

export const IsEditedSchema = BooleanSchema

export const IsReadSchema = BooleanSchema

export const IsOnlineSchema = BooleanSchema

export const IsPublicSchema = BooleanSchema

export const RequiresApprovalSchema = BooleanSchema

export const IsCancelledSchema = BooleanSchema

export const IsAutoRenewSchema = BooleanSchema

// ===========================
// TYPE EXPORTS
// ===========================
export type ObjectIdType = z.infer<typeof ObjectIdSchema>
export type TimestampType = z.infer<typeof TimestampSchema>
export type PaginationType = z.infer<typeof PaginationSchema>
export type PaginationResponseType = z.infer<typeof PaginationResponseSchema>
