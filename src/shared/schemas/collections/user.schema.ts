/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 12:27:39
 * @FilePath      : /server/src/shared/schemas/entities/user.schema.ts
 * @Description   : User schema validation for user entity
 */

import { z } from 'zod'
import { AccountType, AgeRestriction, ProfileType, UserVerifyStatus } from '~/shared/enums'
import { 
  AccountTypeSchema,
  AgeRestrictionSchema,
  AvatarURLSchema,
  BioSchema,
  CloseCircleCountSchema,
  CoverPhotoURLSchema,
  CreatedAtSchema,
  DateOfBirthSchema,
  DeletedAtSchema,
  DeleteReasonSchema,
  EmailSchema,
  EmailVerifyTokenSchema,
  FollowersCountSchema,
  FollowingCountSchema,
  ForgotPasswordTokenSchema,
  GeoPointSchema,
  HashedPasswordSchema,
  IsDeletedSchema,
  IsPrivateSchema,
  NameSchema,
  ObjectIdArraySchema, 
  ObjectIdSchema,
  PostCountSchema,
  ProfileTypeSchema,
  UnreadMessageCountSchema,
  UnreadNotificationCountSchema,
  UpdatedAtSchema,
  UsernameSchema,
  UserVerifyStatusSchema,
  WebsiteArraySchema
} from '~/shared/schemas/primitives'

/**
 * Base User Schema - Core entity structure for user data validation
 * 
 * @description Defines the complete structure of a user entity with all required and optional fields.
 * 
 * @field _id - MongoDB ObjectId identifier for the user
 * @field name - User's display name (required, 1-50 characters)
 * @field email - User's email address (required, unique, valid email format)
 * @field username - User's unique username (required, 3-50 characters, alphanumeric + underscore)
 * @field password - Hashed password for authentication (required, bcrypt hashed)
 * @field date_of_birth - User's birth date (nullable, default: null)
 * @field bio - User's biography/description (default: empty string)
 * @field location - Geographic location coordinates as GeoJSON Point (nullable, default: null)
 * @field website - Array of user's website URLs (default: empty array)
 * @field avatar - Profile picture URL (nullable, default: null)
 * @field cover_photo - Cover photo URL (nullable, default: null)
 * @field verify_status - Account verification status (default: Unverified)
 * @field email_verify_token - Token for email verification (nullable, default: null)
 * @field forgot_password_token - Token for password reset (nullable, default: null)
 * @field close_circle - Array of ObjectIds for close friends (max 150, no duplicates, default: [])
 * @field close_circle_count - Count of users in close circle (must match array length, default: 0)
 * @field followers_count - Number of users following this user (default: 0)
 * @field following_count - Number of users this user follows (default: 0)
 * @field post_count - Total number of posts created by user (default: 0)
 * @field unread_notification_count - Count of unread notifications (default: 0)
 * @field unread_message_count - Count of unread messages (default: 0)
 * @field account_type - Type of user account (Free, Premium, etc., default: Free)
 * @field is_deleted - Soft delete flag (default: false)
 * @field deleted_at - Timestamp when account was deleted (nullable, default: null)
 * @field delete_reason - Reason for account deletion (nullable, default: null)
 * @field roles - Array of role ObjectIds assigned to user (max 10, default: [])
 * @field profile_type - Type of profile (Personal, Business, etc., default: Personal)
 * @field is_private - Privacy setting for user profile (default: false)
 * @field age_restriction - Age restriction level for content (default: None)
 * @field created_at - Account creation timestamp (auto-generated)
 * @field updated_at - Last update timestamp (auto-generated)
 */
export const UserBaseSchema = z.object({
  _id: ObjectIdSchema,
  
  // Required fields
  /** User's display name */
  name: NameSchema,

  /** User's email address */
  email: EmailSchema,
  
  /** User's unique username */
  username: UsernameSchema,

  /** Hashed password for authentication */
  password: HashedPasswordSchema,
  
  // Optional fields - Has default values
  /** User's date of birth */
  date_of_birth: DateOfBirthSchema.default(null),

  /** User's biography or description */
  bio: BioSchema.default(''),

  /** Geographic location coordinates */
  location: GeoPointSchema.nullable().default(null),

  /** Array of user's website URLs */
  website: WebsiteArraySchema.default([]),

  /** Profile picture URL */
  avatar: AvatarURLSchema.nullable().default(null),

  /** Cover photo URL */
  cover_photo: CoverPhotoURLSchema.nullable().default(null),

  // Verification fields
  /** Account verification status */
  verify_status: UserVerifyStatusSchema.default(UserVerifyStatus.Unverified),

  /** Token for email verification */
  email_verify_token: EmailVerifyTokenSchema.nullable().default(null),

  /** Token for password reset */
  forgot_password_token: ForgotPasswordTokenSchema.nullable().default(null),

  // Social fields with defaults
  /** Array of ObjectIds for close friends (max 150, no duplicates) */
  close_circle: ObjectIdArraySchema
    .max(150)
    .refine((arr) => {
      const seen = new Set()
      for (const id of arr) {
        if (seen.has(id.toString())) return false // No duplicates allowed
        seen.add(id.toString())
      }
      return true // No duplicates
    })
    .default([]),

  /** Count of users in close circle */
  close_circle_count: CloseCircleCountSchema.default(0),

  /** Number of users following this user */
  followers_count: FollowersCountSchema.default(0),

  /** Number of users this user follows */
  following_count: FollowingCountSchema.default(0),

  /** Total number of posts created by user */
  post_count: PostCountSchema.default(0),

  /** Count of unread notifications */
  unread_notification_count: UnreadNotificationCountSchema.default(0),

  /** Count of unread messages */
  unread_message_count: UnreadMessageCountSchema.default(0),

  // Account settings with defaults
  /** Type of user account (Free, Premium, etc.) */
  account_type: AccountTypeSchema.default(AccountType.Free),
  
  /** Whether the account has been soft deleted */
  is_deleted: IsDeletedSchema.default(false),
  
  /** Timestamp when account was deleted */
  deleted_at: DeletedAtSchema.nullable().default(null),
  
  /** Reason for account deletion */
  delete_reason: DeleteReasonSchema.nullable().default(null),
  
  /** Array of role ObjectIds assigned to user */
  roles: ObjectIdArraySchema.max(10).default([]),
  
  /** Type of profile (Personal, Business, etc.) */
  profile_type: ProfileTypeSchema.default(ProfileType.Personal),
  
  /** Privacy setting for user profile */
  is_private: IsPrivateSchema.default(false),
  
  /** Age restriction level for content */
  age_restriction: AgeRestrictionSchema.default(AgeRestriction.None),

  // Timestamps
  created_at: CreatedAtSchema.default(() => new Date()),

  updated_at: UpdatedAtSchema.default(() => new Date())
})

/**
 * User Schema with Business Logic Validation
 * 
 * @description Extended user schema that includes business logic refinements and validation rules.
 * This schema ensures data integrity by validating relationships between fields.
 * 
 * @validation close_circle_count - Must exactly match the length of close_circle array
 * @validation soft_delete_logic - If is_deleted is true, both deleted_at and delete_reason must be present
 * @validation soft_delete_consistency - If is_deleted is false, deleted_at and delete_reason must be null
 */
export const UserSchema = UserBaseSchema
  .refine((data) => {
    return data.close_circle_count === data.close_circle.length
  }, { path: ['close_circle_count'] })
  
  .refine((data) => {
    return !data.is_deleted || (data.deleted_at && data.delete_reason)
  }, { path: ['is_deleted'] })
  .refine((data) => {
    return data.is_deleted || (!data.deleted_at && !data.delete_reason)
  }, { path: ['is_deleted'] })

/**
 * User Create Schema - For creating new user documents
 * 
 * @description Schema for user creation operations. Excludes auto-generated fields
 * like _id, created_at, and updated_at which are handled by the database/application.
 * All fields except the core required ones (name, email, username, password) are optional
 * and will use their default values if not provided.
 * 
 * @omits _id - Auto-generated by MongoDB
 * @omits created_at - Auto-generated timestamp
 * @omits updated_at - Auto-generated timestamp
 */
export const UserCreateSchema = UserBaseSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true
})

/**
 * User Update Schema - For updating existing user documents
 * 
 * @description Schema for user update operations. All fields are optional except _id
 * (to identify the user) and updated_at (automatically set). Email updates are not
 * allowed through this schema for security reasons - use separate email change flow.
 * 
 * @required _id - Identifies which user to update
 * @required updated_at - Automatically set to current timestamp
 * @omits email - Email changes require separate verification flow
 * @omits created_at - Should never be modified after creation
 */
export const UserUpdateSchema = UserBaseSchema.omit({
  _id: true,
  email: true,
  created_at: true,
  updated_at: true
})
  .partial()
  .extend({
    _id: ObjectIdSchema,
    updated_at: UpdatedAtSchema.default(() => new Date())
  })

/**
 * Type Definitions for User Schemas
 */
/** 
 * User Type - Inferred from UserSchema with business logic validation
 * @description Complete user object type with all validation rules applied
 */
export type UserType = z.infer<typeof UserSchema>

/** 
 * User Base Type - Inferred from UserBaseSchema without business logic
 * @description Basic user object type without refinement validations
 */
export type UserBaseType = z.infer<typeof UserBaseSchema>

/** 
 * User Create Type - Inferred from UserCreateSchema
 * @description Type for creating new users (excludes auto-generated fields)
 */
export type UserCreateType = z.infer<typeof UserCreateSchema>

/** 
 * User Update Type - Inferred from UserUpdateSchema  
 * @description Type for updating existing users (all fields optional except _id)
 */
export type UserUpdateType = z.infer<typeof UserUpdateSchema>
