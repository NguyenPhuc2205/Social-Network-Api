/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-04 00:25:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 00:25:00
 * @FilePath      : /server/src/shared/enums/group-related.enum.ts
 * @Description   : Enumerations related to group management and permissions
 */

/**
 * Enumeration of privacy settings for groups
 * Determines visibility and access control for groups
 * 
 * @enum {string}
 */
export enum GroupPrivacyType {
  /** Visible to everyone, anyone can join or be added */
  Public = 'Public',
  
  /** Visible in search but requires approval to join */
  Private = 'Private',
  
  /** Not visible in search, members must be invited */
  Secret = 'Secret'
}

/**
 * Enumeration of roles for members within a group
 * Determines permissions and capabilities within the group
 * 
 * @enum {string}
 */
export enum GroupMemberRole {
  /** Full control over group, can manage all aspects */
  Admin = 'Admin',
  
  /** Can manage content and members but not group settings */
  Moderator = 'Moderator',
  
  /** Standard group participant with basic interaction rights */
  Member = 'Member'
}
