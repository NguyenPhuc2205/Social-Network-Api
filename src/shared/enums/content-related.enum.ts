/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 10:39:23
 * @FilePath      : /server/src/shared/enums/content-related.enum.ts
 * @Description   : Enums related to media types, post audiences, and post types
 */

/**
 * Defines the types of media that can be attached to content
 * @enum {string}
 */
export enum MediaType {
  /** Image files (JPG, PNG, etc.) */
  Image = 'Image',

  /** Video files (MP4, MOV, etc.) */
  Video = 'Video',

  /** Animated GIF files */
  Gif = 'Gif',

  /** Audio files (MP3, WAV, etc.) */
  Audio = 'Audio',

  /** Document files (PDF, DOC, XLSX, etc.) */
  Document = 'Document',

  /** External URL links */
  Link = 'Link'
}

/**
 * Defines the visibility options for posts
 * @enum {string}
 */
export enum PostAudience {
  /** Visible to all users of the platform */
  Everyone = 'Everyone',

  /** Visible only to a user's close connections */
  CloseCircle = 'CloseCircle',

  /** Visible only to the user's followers */
  FollowersOnly = 'FollowersOnly',
}

/**
 * Defines the different types of posts available in the system
 * @enum {string}
 */
export enum PostType {
  /** User-created original content post */
  Original = 'Original',

  /** Repost of another user's content */
  Share = 'Share',

  /** Comment on another post */
  Comment = 'Comment',

  /** Post that quotes another post with additional content */
  Quote = 'Quote',

  /** Reply to a comment */
  Reply = 'Reply',

  /** Temporary content that disappears after 24 hours */
  Story = 'Story',

  /** Short-form vertical video content */
  Reel = 'Reel',

  /** Post containing a voting poll */
  Poll = 'Poll'
}

/**
 * Enumeration of reasons for deleting content
 * Used in Post and Message tables to specify why content was deleted
 * 
 * @enum {string}
 */
export enum DeleteReason {
  /** User initiated deletion request */
  UserRequest = 'user_request',

  /** Content was deleted due to a violation of community guidelines */
  PolicyViolation = 'policy_violation',

  /** Content was deleted due to spam or unwanted repetitive content */
  AdminAction = 'admin_action',

  /** Content was deleted due to expired */
  Expired = 'expired',

  /** Content was deleted due to a technical issue or error */
  Other = 'other' // Other reasons
}

/**
 * Enumeration of content types for posts
 * Used to differentiate between short and long content
 * 
 * @enum {string}
 * 
 */
export enum ContentType {
  /** Short content, typically under 500 characters  */
  Short = 'short',

  /** Long content, typically max 5000 characters */
  Long = 'long'
}
