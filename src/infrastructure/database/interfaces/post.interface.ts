/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 21:15:08
 * @FilePath      : /server/src/infrastructure/database/interfaces/post.interface.ts
 * @Description   : Post interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { ContentType, DeleteReason, PostAudience, PostType } from '~/shared/enums'
import { IReactionCounts } from '~/shared/interfaces'
import { IMedia } from './media.interface'

/**
 * Post interface for storing user posts
 * 
 * @interface IPost
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who created the post
 * @property {PostType} type - Type of post (Original, Share, Comment, Quote, Reply, Story, Reel, Poll)
 * @property {PostAudience} audience - Audience visibility (Everyone, CloseCircle, FollowersOnly)
 * @property {string} content - Optional post content text
 * @property {ContentType} content_type - Content type (Short: max 500 chars, Long: max 5000 chars)
 * @property {ObjectId} parent_id - Optional parent post ID for replies/comments
 * @property {ObjectId[]} mentions - Array of mentioned user IDs (max 50)
 * @property {IMedia[]} medias - Array of embedded media objects (max 10)
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
export interface IPost extends BaseSchema {
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
  medias: IMedia[]

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
