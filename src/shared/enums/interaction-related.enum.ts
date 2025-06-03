/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-04 00:25:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 00:25:00
 * @FilePath      : /server/src/shared/enums/interaction-related.enum.ts
 * @Description   : Enumerations for user interactions like notifications and reactions
 */

/**
 * Enumeration of notification types that can be triggered in the system
 * Used to categorize different notifications for appropriate handling and display
 * 
 * @enum {string}
 */
export enum NotificationType {
  /** Notification when someone likes a user's content */
  Like = 'Like',
  
  /** Notification when someone shares a user's content */
  Share = 'Share',
  
  /** Notification when someone follows a user */
  Follow = 'Follow',
  
  /** Notification when a user is mentioned in content */
  Mention = 'Mention',
  
  /** Notification when someone comments on a user's content */
  Comment = 'Comment',
  
  /** Notification when someone quotes a user's post */
  Quote = 'Quote',
  
  /** Notification when someone replies to a user's comment */
  Reply = 'Reply',
  
  /** Notification when a user receives a direct message */
  Message = 'Message',
  
  /** Notification when a user is invited to join a group */
  GroupInvite = 'GroupInvite',
  
  /** Notification when someone requests to join a group managed by the user */
  GroupJoinRequest = 'GroupJoinRequest',
  
  /** Notification when a user is invited to an event */
  EventInvite = 'EventInvite',
  
  /** Notification when an event a user is attending is updated */
  EventUpdate = 'EventUpdate'
}

/**
 * Enumeration of reaction types available for content
 * Used to express emotional responses to posts, comments, etc.
 * 
 * @enum {string}
 */
export enum ReactionType {
  /** Standard positive reaction */
  Like = 'Like',
  
  /** Strong positive emotional reaction */
  Love = 'Love',
  
  /** Humorous reaction indicating content is funny */
  Haha = 'Haha',
  
  /** Reaction indicating surprise or amazement */
  Wow = 'Wow',
  
  /** Reaction expressing sympathy or sadness */
  Sad = 'Sad',
  
  /** Reaction expressing disagreement or outrage */
  Angry = 'Angry'
}
