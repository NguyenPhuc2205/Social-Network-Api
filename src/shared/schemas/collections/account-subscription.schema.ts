/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/collections/account-subscription.schema.ts
 * @Description   : Account subscription schema for Zod validation
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema,
  UpdatedAtSchema
} from '~/shared/schemas/primitives'
import { 
  AccountTypeSchema,
  SubscriptionStatusSchema 
} from '~/shared/schemas/primitives/enum.schema'

// Account Subscription validation schemas
export const AccountSubscriptionBaseSchema = z.object({
  _id: ObjectIdSchema,
  user_id: ObjectIdSchema,
  account_type: AccountTypeSchema,
  start_date: z.date(),
  end_date: z.date().nullable().default(null),
  is_auto_renew: z.boolean().default(true),
  payment_method: z.string().trim().max(100).default(''),
  last_payment_id: ObjectIdSchema.nullable().default(null),
  next_billing_date: z.date().nullable().default(null),
  subscription_status: SubscriptionStatusSchema.default('Active' as any),
  price_paid: z.number().min(0).default(0),
  currency: z.string().length(3).default('USD'),
  billing_cycle: z.string().trim().max(50).default('monthly'),
  cancelled_at: z.date().nullable().default(null),
  cancel_reason: z.string().trim().max(500).nullable().default(null),
  
  created_at: CreatedAtSchema.default(() => new Date()),
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export const AccountSubscriptionSchema = AccountSubscriptionBaseSchema
  .refine((data) => {
    const typedData = data as any
    return !typedData.end_date || typedData.end_date > typedData.start_date
  }, {
    message: 'End date must be after start date',
    path: ['end_date']
  })

export const AccountSubscriptionCreateSchema = AccountSubscriptionBaseSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true
})

export const AccountSubscriptionUpdateSchema = AccountSubscriptionCreateSchema.partial().extend({
  _id: ObjectIdSchema,
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export type AccountSubscriptionBaseType = z.infer<typeof AccountSubscriptionBaseSchema>
export type AccountSubscriptionType = z.infer<typeof AccountSubscriptionSchema>
export type AccountSubscriptionCreateType = z.infer<typeof AccountSubscriptionCreateSchema>
export type AccountSubscriptionUpdateType = z.infer<typeof AccountSubscriptionUpdateSchema>
