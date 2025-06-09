/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-08 23:19:14
 * @FilePath      : /server/src/infrastructure/database/schemas/content-related.schema.ts
 * @Description   : Content-related schema for MongoDB
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schemas'
import { ContentType, DeleteReason, MediaType, PostAudience, PostType, ReactionType } from '~/shared/enums'
import { IGeoJsonPoint, IMediaDimensions, IPollOption, IReactionCounts } from '~/shared/interfaces'

/**
 * Media schema for storing media files
 * 
 * @interface IMediaSchema
 * @extends BaseSchema
 * @property {string} url - URL to the media file
 * @property {MediaType} type - Type of media (Image, Video, Gif, Audio, Document, Link)
 * @property {number} size - File size in bytes
 * @property {IMediaDimensions} media_dimensions - Optional dimensions for images/videos
 */
export interface IMediaSchema extends BaseSchema {
  /** URL to the media file */
  url: string
  /** Type of media (Image, Video, Gif, Audio, Document, Link) */
  type: MediaType
  /** File size in bytes */
  size: number
  /** Optional dimensions for images/videos */
  media_dimensions?: IMediaDimensions
}

/**
 * Post schema for storing user posts
 * 
 * @interface IPostSchema
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who created the post
 * @property {PostType} type - Type of post (Original, Share, Comment, Quote, Reply, Story, Reel, Poll)
 * @property {PostAudience} audience - Audience visibility (Everyone, CloseCircle, FollowersOnly)
 * @property {string} content - Optional post content text
 * @property {ContentType} content_type - Content type (Short: max 500 chars, Long: max 5000 chars)
 * @property {ObjectId} parent_id - Optional parent post ID for replies/comments
 * @property {ObjectId[]} mentions - Array of mentioned user IDs (max 50)
 * @property {IMediaSchema[]} medias - Array of embedded media objects (max 10)
 * @property {number} guest_views - Number of guest views
 * @property {number} user_views - Number of user views
 * @property {number} reaction_count - Total reaction count
 * @property {IReactionCounts} reaction_counts - Count of each reaction type
 * @property {number} share_count - Number of shares
 * @property {number} comment_count - Number of comments
 * @property {number} bookmark_count - Number of bookmarks
 * @property {boolean} is_deleted - Whether the post is soft deleted
 * @property {Date} deleted_at - Optional timestamp when post was deleted
 * @property {DeleteReason} delete_reason - Optional reason for deletion
 */
export interface IPostSchema extends BaseSchema {
  /** ID of the user who created the post */
  user_id: ObjectId
  /** Type of post (Original, Share, Comment, etc.) */
  type: PostType
  /** Audience visibility (Everyone, CloseCircle, FollowersOnly) */
  audience: PostAudience
  /** Post content text */
  content?: string
  /** Content type (Short: max 500 chars, Long: max 5000 chars) */
  content_type: ContentType
  /** Parent post ID for replies/comments */
  parent_id?: ObjectId
  /** Array of mentioned user IDs (max 50) */
  mentions: ObjectId[]
  /** Array of embedded media objects (max 10) */
  medias: IMediaSchema[]

  /** Number of guest views */
  guest_views: number
  /** Number of user views */
  user_views: number
  /** Total reaction count */
  reaction_count: number
  /** Count of each reaction type */
  reaction_counts: IReactionCounts
  /** Number of shares */
  share_count: number
  /** Number of comments */
  comment_count: number
  /** Number of bookmarks */
  bookmark_count: number

  /** Whether the post is soft deleted */
  is_deleted: boolean
  /** Timestamp when post was deleted */
  deleted_at?: Date
  /** Reason for deletion */
  delete_reason?: DeleteReason
}

/**
 * Hashtag schema for storing hashtags
 * 
 * @interface IHashtagSchema
 * @extends BaseSchema
 * @property {string} name - Unique hashtag name
 * @property {number} post_count - Number of posts using this hashtag
 */
export interface IHashtagSchema extends BaseSchema {
  /** Unique hashtag name */
  name: string
  /** Number of posts using this hashtag */
  post_count: number
}

/**
 * Post-Hashtag relationship schema
 * 
 * @interface IPostHashtagSchema
 * @extends BaseSchema
 * @property {ObjectId} post_id - Post ID
 * @property {ObjectId} hashtag_id - Hashtag ID
 */
export interface IPostHashtagSchema extends BaseSchema {
  /** Post ID */
  post_id: ObjectId
  /** Hashtag ID */
  hashtag_id: ObjectId
}

/**
 * Post category schema for organizing posts
 * 
 * @interface IPostCategorySchema
 * @extends BaseSchema
 * @property {string} name - Category name
 * @property {string} description - Optional category description
 * @property {string} icon - Optional URL to category icon or icon identifier
 * @property {ObjectId} parent_id - Optional parent category ID for nested categories
 */
export interface IPostCategorySchema extends BaseSchema {
  /** Category name */
  name: string
  /** Category description */
  description?: string
  /** URL to category icon or icon identifier */
  icon?: string
  /** Parent category ID for nested categories */
  parent_id?: ObjectId
}

/**
 * Post-PostCategory relationship schema for many-to-many relationship between posts and categories
 * 
 * @interface IPostPostCategorySchema
 * @extends BaseSchema
 * @property {ObjectId} post_id - Reference to the post
 * @property {ObjectId} category_id - Reference to the category
 */
export interface IPostPostCategorySchema extends BaseSchema {
  /** Reference to the post */
  post_id: ObjectId
  /** Reference to the category */
  category_id: ObjectId
}

/**
 * Trend schema for tracking trending topics and hashtags
 * 
 * @interface ITrendSchema
 * @extends BaseSchema
 * @property {string} name - Name of the trending topic
 * @property {ObjectId} hashtag_id - Optional reference to hashtag if trend is hashtag-based
 * @property {number} post_count - Total number of posts related to this trend
 * @property {number} trend_score - Calculated score based on velocity, volume, and engagement
 * @property {IGeoJsonPoint} location - Optional geographic location for location-specific trends
 */
export interface ITrendSchema extends BaseSchema {
  /** Name of the trending topic */
  name: string
  /** Optional reference to hashtag if trend is hashtag-based */
  hashtag_id?: ObjectId
  /** Total number of posts related to this trend */
  post_count: number
  /** Calculated score based on velocity, volume, and engagement */
  trend_score: number
  /** Optional geographic location for location-specific trends */
  location?: IGeoJsonPoint
}

/**
 * Reaction schema for storing user reactions to posts
 * 
 * @interface IReactionSchema
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who reacted
 * @property {ObjectId} post_id - ID of the post that was reacted to
 * @property {ReactionType} type - Type of reaction (Like, Love, Haha, Wow, Sad, Angry)
 */
export interface IReactionSchema extends BaseSchema {
  /** ID of the user who reacted */
  user_id: ObjectId
  /** ID of the post that was reacted to */
  post_id: ObjectId
  /** Type of reaction (Like, Love, Haha, Wow, Sad, Angry) */
  type: ReactionType
}

/**
 * Bookmark schema for storing user bookmarks of posts
 * 
 * @interface IBookmarkSchema
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who bookmarked the post
 * @property {ObjectId} post_id - ID of the post that was bookmarked
 */
export interface IBookmarkSchema extends BaseSchema {
  /** ID of the user who bookmarked the post */
  user_id: ObjectId
  /** ID of the post that was bookmarked */
  post_id: ObjectId
}

/**
 * Poll schema for storing poll data attached to posts
 * 
 * @interface IPollSchema
 * @extends BaseSchema
 * @property {ObjectId} post_id - ID of the post that contains this poll
 * @property {string} question - The poll question text
 * @property {IPollOption[]} options - Array of poll options with text and vote count (max 10)
 * @property {Date} end_time - Optional expiration time for the poll
 */
export interface IPollSchema extends BaseSchema {
  /** ID of the post that contains this poll */
  post_id: ObjectId
  /** The poll question text */
  question: string
  /** Array of poll options with text and vote count (max 10) */
  options: IPollOption[]
  /** Optional expiration time for the poll */
  end_time?: Date
}

/**
 * Poll vote schema for tracking individual user votes on polls
 * 
 * @interface IPollVoteSchema
 * @extends BaseSchema
 * @property {ObjectId} poll_id - ID of the poll being voted on
 * @property {ObjectId} user_id - ID of the user who voted
 * @property {number} option_index - Index of the selected option in the poll's options array
 */
export interface IPollVoteSchema extends BaseSchema {
  /** ID of the poll being voted on */
  poll_id: ObjectId
  /** ID of the user who voted */
  user_id: ObjectId
  /** Index of the selected option in the poll's options array */
  option_index: number
}
