/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-09 21:34:17
 * @FilePath      : /server/src/infrastructure/database/schemas/payment-related.schema.ts
 * @Description   : Business and payment-related schemas for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schemas'
import { 
  AccountType,
  PaymentStatus,
  SubscriptionStatus
} from '~/shared/enums'

/**
 * Account subscription schema for managing user premium subscriptions
 * 
 * @interface IAccountSubscriptionSchema
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who owns the subscription
 * @property {AccountType} account_type - Type of subscription account (Free, Premium, Business)
 * @property {Date} start_date - Date when the subscription started
 * @property {Date} end_date - Optional expiration date (null for lifetime subscriptions)
 * @property {boolean} is_auto_renew - Whether the subscription automatically renews
 * @property {string} payment_method - Payment provider identifier (e.g., 'stripe', 'paypal')
 * @property {ObjectId} last_payment_id - Optional reference to the most recent payment
 * @property {Date} next_billing_date - Optional date of the next billing cycle
 * @property {SubscriptionStatus} subscription_status - Current status (Active, Cancelled, Expired, etc.)
 * @property {number} price_paid - Amount paid for the subscription
 * @property {string} currency - ISO currency code (e.g., 'USD', 'EUR')
 * @property {string} billing_cycle - Billing frequency (e.g., 'monthly', 'yearly')
 * @property {Date} cancelled_at - Optional timestamp when subscription was cancelled
 * @property {string} cancel_reason - Optional reason for subscription cancellation
 */
export interface IAccountSubscriptionSchema extends BaseSchema {
  /** ID of the user who owns the subscription */
  user_id: ObjectId

  /** Type of subscription account (Free, Premium, Business) */
  account_type: AccountType
  /** Date when the subscription started */
  start_date: Date
  /** Optional expiration date (null for lifetime subscriptions) */
  end_date?: Date

  /** Whether the subscription automatically renews */
  is_auto_renew: boolean
  /** Payment provider identifier (e.g., 'stripe', 'paypal') */
  payment_method: string
  /** Optional reference to the most recent payment */
  last_payment_id?: ObjectId

  /** Optional date of the next billing cycle */
  next_billing_date?: Date
  /** Current status (Active, Cancelled, Expired, etc.) */
  subscription_status: SubscriptionStatus
  /** Amount paid for the subscription */
  price_paid: number
  /** ISO currency code (e.g., 'USD', 'EUR') */
  currency: string
  /** Billing frequency (e.g., 'monthly', 'yearly') */
  billing_cycle: string

  /** Optional timestamp when subscription was cancelled */
  cancelled_at?: Date
  /** Optional reason for subscription cancellation */
  cancel_reason?: string
}

/**
 * Payment schema for tracking financial transactions and payments
 * 
 * @interface IPaymentSchema
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who made the payment
 * @property {ObjectId} subscription_id - Optional reference to the related subscription
 * @property {number} amount - Payment amount in the specified currency
 * @property {string} currency - ISO currency code for the payment
 * @property {PaymentStatus} status - Current payment status (Pending, Completed, Failed, etc.)
 * @property {string} payment_method - Payment provider used (e.g., 'stripe', 'paypal')
 * @property {string} transaction_id - Unique transaction ID from the payment processor
 * @property {string} invoice_url - Optional URL to invoice
 * @property {Date} payment_date - Date when the payment was initiated
 * @property {Date} processed_at - Optional timestamp when payment was successfully processed
 * @property {Date} failed_at - Optional timestamp when payment failed
 * @property {string} failure_reason - Optional reason for payment failure
 * @property {Date} refunded_at - Optional timestamp when payment was refunded
 * @property {number} refund_amount - Optional amount that was refunded
 * @property {string} refund_reason - Optional reason for issuing the refund
 */
export interface IPaymentSchema extends BaseSchema {
  /** ID of the user who made the payment */
  user_id: ObjectId
  /** Reference to the related subscription */
  subscription_id?: ObjectId
  
  /** Payment amount in the specified currency */
  amount: number
  /** ISO currency code for the payment */
  currency: string
  /** Current payment status (Pending, Completed, Failed, etc.) */
  status: PaymentStatus
  
  /** Payment provider used (e.g., 'stripe', 'paypal') */
  payment_method: string
  /** Unique transaction ID from the payment processor */
  transaction_id?: string
  /** Optional URL to invoice */
  invoice_url?: string
  /** Date when the payment was initiated */
  payment_date: Date
  
  /** Optional timestamp when payment was successfully processed */
  processed_at?: Date
  /** Optional timestamp when payment failed */
  failed_at?: Date
  /** Optional reason for payment failure */
  failure_reason?: string
  
  /** Optional timestamp when payment was refunded */
  refunded_at?: Date
  /** Optional amount that was refunded */
  refund_amount?: number
  /** Optional reason for issuing the refund */
  refund_reason?: string
}
