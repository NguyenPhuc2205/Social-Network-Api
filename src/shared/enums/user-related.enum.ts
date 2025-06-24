/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 00:56:03
 * @FilePath      : /server/src/shared/enums/user-related.enum.ts
 * @Description   : Define user-related enums for account verification status, account type, and age restriction
 */

/**
 * User verification status enum when regitering or logging in
 * @export
 * @enum {number}
 */
export enum UserVerifyStatus {
  /** Email not verify, default when regiter */
  Unverified = 'Unverified',

  /** Email verified, user can login */
  Verified = 'Verified',

  /** User banned, cannot login */
  Banned = 'Banned'
}

/**
 * Account type enum
 * Payment to upgrade account levels
 * 
 * @export
 * @enum {number}
 */
export enum AccountType {
  /** Free account, default when create a new User */
  Free = 'Free',

  /** Premium account with additional features */
  Premium = 'Premium',

  /** Verified account with enhanced trust */
  Verified = 'Verified',

  /** Business account for organizations */
  Business = 'Business',

  /** Creator account for content creators */
  Creator = 'Creator'
}

/**
 * Age restriction enum
 * @export
 * @enum {number}
 */
export enum AgeRestriction {
  /** No age restriction */
  None = 'None',

  /* 13+ age restriction */
  Age13 = 'Age13',

  /* 18+ age restriction */
  Age18 = 'Age18', 
}
