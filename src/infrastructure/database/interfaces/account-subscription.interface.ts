/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 21:40:47
 * @FilePath      : /server/src/infrastructure/database/interfaces/account-subscription.interface.ts
 * @Description   : Account subscription interface for managing user premium subscriptions
 */
import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { AccountType, SubscriptionStatus } from '~/shared/enums'

/**
 * Account subscription interface for managing user premium subscriptions
 * 
 * @interface IAccountSubscription
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
export interface IAccountSubscription extends BaseSchema {
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