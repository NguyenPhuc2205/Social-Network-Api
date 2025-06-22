/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-17 18:36:22
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 20:45:07
 * @FilePath      : /server/src/infrastructure/database/interfaces/user.interface.ts
 * @Description   : User interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { UserVerifyStatus, AccountType, DeleteReason, ProfileType, AgeRestriction } from '~/shared/enums'
import { IGeoJsonPoint } from '~/shared/interfaces'

/**
 * User interface for managing user accounts and profiles
 * 
 * @interface IUser
 * @extends BaseSchema
 * @property {string} name - User's display name (1-50 characters)
 * @property {string} email - User's email address (unique, valid format required)
 * @property {string} username - User's unique username (3-20 characters, alphanumeric and underscore only)
 * @property {string} password - User's password (stored as bcrypt hash, min 8 characters)
 * @property {Date} date_of_birth - Optional date of birth for age verification
 * @property {string} bio - Optional user biography (max 500 characters)
 * @property {IGeoJsonPoint} location - Optional geographic location coordinates
 * @property {string[]} website - Optional array of website URLs (max 3 items, each max 100 characters)
 * @property {string} avatar - Optional URL to user's avatar image
 * @property {string} cover_photo - Optional URL to user's cover photo
 * @property {UserVerifyStatus} verify_status - Email verification status
 * @property {string} email_verify_token - Optional token for email verification
 * @property {Date} email_verify_token_expires_at - Optional expiry time for verification token
 * @property {string} forgot_password_token - Optional token for password reset
 * @property {Date} forgot_password_token_expires_at - Optional expiry time for password reset token
 * @property {ObjectId[]} close_circle - List of user IDs in private circle for restricted post visibility (max 150)
 * @property {number} close_circle_count - Count of users in close circle (max 150)
 * @property {number} followers_count - Total number of followers
 * @property {number} following_count - Total number of users being followed
 * @property {number} post_count - Total number of posts created by the user
 * @property {number} unread_notification_count - Count of unread notifications
 * @property {number} unread_message_count - Count of unread messages
 * @property {AccountType} account_type - Account subscription type (Free, Premium, Verified, Business, Creator)
 * @property {boolean} is_deleted - Whether the account has been soft deleted
 * @property {Date} deleted_at - Optional timestamp when user account was deleted
 * @property {DeleteReason} delete_reason - Optional reason for account deletion
 * @property {ObjectId[]} roles - Array of role IDs assigned to the user for permissions
 * @property {ProfileType} profile_type - Profile type (Personal, Business, Creator, Organization)
 * @property {boolean} is_private - Whether the user profile is private
 * @property {AgeRestriction} age_restriction - Age restriction level for content filtering
 */
export interface IUser extends BaseSchema {
  /** User's display name (1-50 characters) */
  name: string
  /** User's email address (unique, valid format required) */
  email: string
  /** User's unique username (3-20 characters, alphanumeric and underscore only) */
  username: string
  /** User's password (stored as bcrypt hash, min 8 characters) */
  password: string

  /** Optional date of birth for age verification */
  date_of_birth?: Date | null
  /** Optional user biography (max 500 characters) */
  bio?: string
  /** Optional geographic location coordinates */
  location?: IGeoJsonPoint | null
  /** Optional array of website URLs (max 3 items, each max 100 characters) */
  website?: string[]
  /** Optional URL to user's avatar image */
  avatar?: string
  /** Optional URL to user's cover photo */
  cover_photo?: string

  /** Email verification status */
  verify_status: UserVerifyStatus
  /** Optional token for email verification */
  email_verify_token?: string
  /** Optional token for password reset */
  forgot_password_token?: string

  /** List of user IDs in private circle for restricted post visibility (max 150) */
  close_circle: ObjectId[]
  /** Count of users in close circle (max 150) */
  close_circle_count: number
  
  /** Total number of followers */
  followers_count: number
  /** Total number of users being followed */
  following_count: number
  /** Total number of posts created by the user */
  post_count: number
  /** Count of unread notifications */
  unread_notification_count: number
  /** Count of unread messages */
  unread_message_count: number

  /** Account subscription type (Free, Premium, Verified, Business, Creator) */
  account_type: AccountType
  /** Whether the account has been soft deleted */
  is_deleted: boolean
  /** Optional timestamp when user account was deleted */
  deleted_at?: Date | null
  /** Optional reason for account deletion */
  delete_reason?: DeleteReason | null
  /** Array of role IDs assigned to the user for permissions */
  roles: ObjectId[]

  /** Profile type (Personal, Business, Creator, Organization) */
  profile_type: ProfileType
  /** Whether the user profile is private */
  is_private: boolean
  /** Age restriction level for content filtering */
  age_restriction: AgeRestriction
}
