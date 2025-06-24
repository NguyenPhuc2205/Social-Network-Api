/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-04 09:37:41
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 09:39:27
 * @FilePath      : /server/src/shared/enums/subscription-related.enum.ts
 * @Description   : Enums related to subscription statuses for user accounts
 */

/**
 * Enumeration of subscription statuses for user accounts
 * Used to track the state of a subscription in the AccountSubscription table
 * 
 * @enum {string}
 */
export enum SubscriptionStatus {
  /** Subscription is currently active */
  Active = 'active',

  /** Subscription has expired */
  Expired = 'expired',

  /** Subscription has been cancelled by the user or admin */
  Cancelled = 'cancelled',

  /** Subscription is pending activation (e.g., awaiting payment confirmation) */
  Pending = 'pending'
}
