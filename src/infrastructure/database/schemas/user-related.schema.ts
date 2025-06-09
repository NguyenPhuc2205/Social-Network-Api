/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-09 10:52:32
 * @FilePath      : /server/src/infrastructure/database/schemas/user-related.schema.ts
 * @Description   : User-related schema for MongoDB
 */
import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schemas'
import { AccountType, AgeRestriction, DeleteReason, ProfileType, UserVerifyStatus } from '~/shared/enums'
import { IAccessibilitySettings, IContentPreferences, IGeoJsonPoint, ILoginHistory, INotificationPreferences, IPrivacySettings } from '~/shared/interfaces'

/**
 * User schema for managing user accounts and profiles
 * 
 * @interface IUserSchema
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
export interface IUserSchema extends BaseSchema {
  /** User's display name (1-50 characters) */
  name: string
  /** User's email address (unique, valid format required) */
  email: string
  /** User's unique username (3-20 characters, alphanumeric and underscore only) */
  username: string
  /** User's password (stored as bcrypt hash, min 8 characters) */
  password: string

  /** Optional date of birth for age verification */
  date_of_birth?: Date
  /** Optional user biography (max 500 characters) */
  bio?: string
  /** Optional geographic location coordinates */
  location?: IGeoJsonPoint
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
  /** Optional expiry time for verification token */
  email_verify_token_expires_at?: Date
  /** Optional token for password reset */
  forgot_password_token?: string
  /** Optional expiry time for password reset token */
  forgot_password_token_expires_at?: Date

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
  deleted_at?: Date
  /** Optional reason for account deletion */
  delete_reason?: DeleteReason
  /** Array of role IDs assigned to the user for permissions */
  roles: ObjectId[]

  /** Profile type (Personal, Business, Creator, Organization) */
  profile_type: ProfileType
  /** Whether the user profile is private */
  is_private: boolean
  /** Age restriction level for content filtering */
  age_restriction: AgeRestriction
}

/**
 * User session schema for managing user sessions and device tracking
 * 
 * @interface IUserSessionSchema
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who owns this session
 * @property {string} device_id - Unique identifier for the device
 * @property {string} device_info - Optional browser/device information string
 * @property {string} device_name - Optional user-friendly name for the device
 * @property {string} platform - Optional platform identifier (iOS, Android, Web, Desktop)
 * @property {string} user_agent - Optional full user agent string from the browser
 * @property {string} browser - Optional browser name (Chrome, Safari, Firefox, etc.)
 * @property {string} os - Optional operating system (Windows, macOS, Linux, iOS, Android)
 * @property {string} ip_address - Optional IP address for the session
 * @property {boolean} is_active - Whether the session is currently active
 * @property {Date} last_activity - Timestamp of the last activity in this session
 * @property {ILoginHistory[]} login_history - Array of login histories with timestamps and IP addresses
 */
export interface IUserSessionSchema extends BaseSchema {
  /** ID of the user who owns this session */
  user_id: ObjectId
  /** Unique identifier for the device */
  device_id: string

  /** Optional browser/device information string */
  device_info?: string
  /** Optional user-friendly name for the device */
  device_name?: string
  /** Optional platform identifier (iOS, Android, Web, Desktop) */
  platform?: string
  /** Optional full user agent string from the browser */
  user_agent?: string
  /** Optional browser name (Chrome, Safari, Firefox, etc.) */
  browser?: string
  /** Optional operating system (Windows, macOS, Linux, iOS, Android) */
  os?: string
  /** Optional IP address for the session */
  ip_address?: string

  /** Whether the session is currently active */
  is_active: boolean
  /** Timestamp of the last activity in this session */
  last_activity: Date

  /** Array of login histories with timestamps and IP addresses */
  login_history: ILoginHistory[]
}

/**
 * User preferences schema for storing personalized settings per device
 * 
 * @interface IUserPreferencesSchema
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who owns these preferences
 * @property {ObjectId} session_id - Optional session ID for device-specific preferences
 * @property {string} device_id - Unique identifier for the device
 * @property {string} theme - Theme preference (light, dark, or system)
 * @property {string} language - Language code (e.g., 'en', 'vi')
 * @property {string} timezone - Timezone identifier (e.g., 'Asia/Ho_Chi_Minh')
 * @property {INotificationPreferences} notification_preferences - User's notification settings
 * @property {IPrivacySettings} privacy_settings - User's privacy configuration
 * @property {IAccessibilitySettings} accessibility_settings - User's accessibility options
 * @property {IContentPreferences} content_preferences - User's content filtering preferences
 */
export interface IUserPreferencesSchema extends BaseSchema {
  /** ID of the user who owns these preferences */
  user_id: ObjectId
  /** Optional session ID for device-specific preferences */
  session_id?: ObjectId
  /** Unique identifier for the device */
  device_id: string

  /** Theme preference (light, dark, or system) */
  theme: string
  /** Language code (e.g., 'en', 'vi') */
  language: string
  /** Timezone identifier (e.g., 'Asia/Ho_Chi_Minh') */
  timezone: string

  /** User's notification settings */
  notification_preferences: INotificationPreferences
  /** User's privacy configuration */
  privacy_settings: IPrivacySettings
  /** User's accessibility options */
  accessibility_settings: IAccessibilitySettings
  /** User's content filtering preferences */
  content_preferences: IContentPreferences
}

/**
 * Refresh token schema for managing JWT refresh tokens and authentication
 * 
 * @interface IRefreshTokenSchema
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who owns this token
 * @property {ObjectId} session_id - Session ID for device-specific token management
 * @property {string} device_id - Device identifier for device-specific tokens
 * @property {string} token - Unique refresh token string for authentication
 * @property {Date} expires_at - Token expiration date and time
 */
export interface IRefreshTokenSchema extends BaseSchema {
  /** ID of the user who owns this token */
  user_id: ObjectId // Reference to User._id
  /** Session ID for device-specific token management */
  session_id: ObjectId
  /** Device identifier for device-specific tokens */
  device_id: string

  /** Unique refresh token string for authentication */
  token: string
  /** Token expiration date and time */
  expires_at: Date
}

/**
 * Follower relationship schema for managing user follow relationships
 * 
 * @interface IFollowerSchema
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who is following
 * @property {ObjectId} followed_user_id - ID of the user being followed
 */
export interface IFollowerSchema extends BaseSchema {
  /** ID of the user who is following */
  user_id: ObjectId // User who follows
  /** ID of the user being followed */
  followed_user_id: ObjectId // User being followed
}
