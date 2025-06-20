/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 09:40:24
 * @FilePath      : /server/src/shared/enums/profile-related.enum.ts
 * @Description   : Enum for user profile types
 */

/**
 * Enumeration of profile types a user account can have
 * 
 * @enum {string}
 */
export enum ProfileType {
  /** Standard individual user account */
  Personal = 'Personal',
  
  /** Business or company account */
  Business = 'Business',
  
  /** Content creator or influencer account */
  Creator = 'Creator',
  
  /** Non-profit, educational, or other organizational account */
  Organization = 'Organization'
}
