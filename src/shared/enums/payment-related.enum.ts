/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-04 09:06:33
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 09:40:24
 * @FilePath      : /server/src/shared/enums/payment-related.enum.ts
 * @Description   : Enums related to payment statuses for transactions
 */

/**
 * Enumeration of payment statuses for transactions
 * Used to track the state of payments in the Payment table
 * 
 * @enum {string}
 */
export enum PaymentStatus {
  /** Payment is awaiting confirmation */
  Pending = 'pending',
  
  /** Payment has been successfully completed */
  Completed = 'completed',
  
  /** Payment failed due to an error */
  Failed = 'failed',
  
  /** Payment was refunded to the user */
  Refunded = 'refunded'
}
