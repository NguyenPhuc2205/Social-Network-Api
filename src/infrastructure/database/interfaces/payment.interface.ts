/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-09 21:34:17
 * @FilePath      : /server/src/infrastructure/database/interfaces/payment-related.interface.ts
 * @Description   : Payment interfaces for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import {
  PaymentStatus,
} from '~/shared/enums'

/**
 * Payment interface for tracking financial transactions and payments
 * 
 * @interface IPayment
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
export interface IPayment extends BaseSchema {
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
