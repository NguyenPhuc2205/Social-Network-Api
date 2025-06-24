/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/user-preferences.interface.ts
 * @Description   : User preferences interface for MongoDB Native Driver
 */
import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { IAccessibilitySettings, IContentPreferences, INotificationPreferences, IPrivacySettings } from '~/shared/interfaces'

/**
 * User preferences interface for storing personalized settings per device
 * 
 * @interface IUserPreferences
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
export interface IUserPreferences extends BaseSchema {
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
