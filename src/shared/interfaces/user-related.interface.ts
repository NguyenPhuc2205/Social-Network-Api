/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 23:48:01
 * @FilePath      : /server/src/shared/interfaces/user-related.interface.ts
 * @Description   : Interfaces related to user profiles, preferences, and settings
 */

/**
 * GeoJSON Point representation for location data
 * 
 * @interface IGeoJsonPoint
 * @property {'Point'} type - The GeoJSON type, always 'Point' for this interface
 * @property {[number, number]} coordinates - Longitude and latitude coordinates [longitude, latitude]
 */
export interface IGeoJsonPoint {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}

/**
 * Records information about user login attempts
 * 
 * @interface ILoginHistory
 * @property {Date} timestamp - Time of the login attempt
 * @property {string} ip_address - IP address of the login attempt
 * @property {string} location - Approximate location of the login
 * @property {boolean} success - Whether the login was successful
 */
export interface ILoginHistory {
  timestamp: Date 
  ip_address: string
  location: string
  success: boolean
}

/**
 * User preferences for different types of notifications
 * 
 * @interface INotificationPreferences
 * @property {boolean} push - Enable push notifications
 * @property {boolean} email - Enable email notifications
 * @property {boolean} in_app - Enable in-app notifications
 * @property {boolean} mentions - Notify on mentions
 * @property {boolean} follows - Notify on new followers
 * @property {boolean} replies - Notify on replies
 * @property {boolean} messages - Notify on new messages
 * @property {boolean} group_invites - Notify on group invites
 * @property {boolean} group_join_requests - Notify on group join requests
 * @property {boolean} event_invites - Notify on event invites
 * @property {boolean} event_updates - Notify on event updates
 * @property {boolean} new_features - Notify on new feature announcements
 */
export interface INotificationPreferences {
  push: boolean
  email: boolean
  in_app: boolean
  mentions: boolean
  follows: boolean
  replies: boolean
  messages: boolean
  group_invites: boolean
  group_join_requests: boolean
  event_invites: boolean
  event_updates: boolean
  new_features: boolean
}

/**
 * User privacy settings controlling visibility and interaction permissions
 * 
 * @interface IPrivacySettings
 * @property {'everyone' | 'followers_only' | 'nobody'} direct_message - Who can send direct messages
 * @property {'everyone' | 'followers_only' | 'nobody'} tag_permission - Who can tag the user
 * @property {boolean} discoverable_by_email - Allow discovery by email
 * @property {boolean} discoverable_by_phone - Allow discovery by phone
 */
export interface IPrivacySettings {
  direct_message: 'everyone' | 'followers_only' | 'nobody' // Who can send direct messages
  tag_permission: 'everyone' | 'followers_only' | 'nobody' // Who can tag the user
  discoverable_by_email: boolean 
  discoverable_by_phone: boolean 
}

/**
 * Accessibility settings for user experience
 * 
 * @interface IAccessibilitySettings
 * @property {'small' | 'medium' | 'large' | 'extra_large'} font_size - Font size preference
 * @property {boolean} reduce_motion - Reduce animations and motion
 * @property {boolean} high_contrast - Enable high contrast mode
 */
export interface IAccessibilitySettings {
  font_size: 'small' | 'medium' | 'large' | 'extra_large' // Font size preference
  reduce_motion: boolean
  high_contrast: boolean
}

/**
 * Content preferences for user experience
 * 
 * @interface IContentPreferences
 * @property {boolean} sensitive_content - Show sensitive content
 * @property {boolean} personalized_ads - Enable personalized ads
 * @property {boolean} curated_timeline - Enable curated timeline
 */
export interface IContentPreferences {
  sensitive_content: boolean 
  personalized_ads: boolean 
  curated_timeline: boolean
}
