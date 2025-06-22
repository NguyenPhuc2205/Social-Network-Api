/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/collections/payment.schema.ts
 * @Description   : Payment schema for Zod validation
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema
} from '~/shared/schemas/primitives'
import { PaymentStatusSchema } from '~/shared/schemas/primitives/enum.schema'

// Payment validation schemas
export const PaymentBaseSchema = z.object({
  _id: ObjectIdSchema,
  user_id: ObjectIdSchema,
  subscription_id: ObjectIdSchema.nullable().default(null),
  amount: z.number().min(0),
  currency: z.string().length(3).default('USD'),
  payment_method: z.string().trim().max(100),
  transaction_id: z.string().trim().max(200).nullable().default(null),
  status: PaymentStatusSchema.default('Pending' as any),
  invoice_url: z.string().url().nullable().default(null),
  payment_date: z.date(),
  processed_at: z.date().nullable().default(null),
  failed_at: z.date().nullable().default(null),
  failure_reason: z.string().trim().max(500).nullable().default(null),
  refunded_at: z.date().nullable().default(null),
  refund_amount: z.number().min(0).nullable().default(null),
  refund_reason: z.string().trim().max(500).nullable().default(null),
  
  created_at: CreatedAtSchema.default(() => new Date())
})

export const PaymentSchema = PaymentBaseSchema
  .refine((data) => {
    const typedData = data as any
    return !typedData.refund_amount || typedData.refund_amount <= typedData.amount
  }, {
    message: 'Refund amount cannot exceed payment amount',
    path: ['refund_amount']
  })

export const PaymentCreateSchema = PaymentBaseSchema.omit({
  _id: true,
  created_at: true
})

export const PaymentUpdateSchema = PaymentCreateSchema.partial().extend({
  _id: ObjectIdSchema
})

export type PaymentBaseType = z.infer<typeof PaymentBaseSchema>
export type PaymentType = z.infer<typeof PaymentSchema>
export type PaymentCreateType = z.infer<typeof PaymentCreateSchema>
export type PaymentUpdateType = z.infer<typeof PaymentUpdateSchema>
