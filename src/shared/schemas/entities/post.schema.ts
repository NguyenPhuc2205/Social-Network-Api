/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/entities/post.schema.ts
 * @Description   : Post schema validation for post entity
 */

import { z } from 'zod'
import { 
  ObjectIdSchema,
  ObjectIdArraySchema,
  PostTypeSchema,
  PostAudienceSchema,
  ContentSchema,
  ContentTypeSchema,
  GuestViewsSchema,
  UserViewsSchema,
  ReactionCountSchema,
  ReactionCountsSchema,
  ShareCountSchema,
  CommentCountSchema,
  BookmarkCountSchema,
  IsDeletedSchema,
  DeletedAtSchema,
  DeleteReasonSchema,
  CreatedAtSchema,
  UpdatedAtSchema,
  MediaArraySchema
} from '~/shared/schemas/primitives'
import { PostAudience, PostType as PostTypeEnum, ContentType } from '~/shared/enums'

// Base schema without refinements for easier composition
export const PostBaseSchema = z.object({
  _id: ObjectIdSchema,

  user_id: ObjectIdSchema,
  type: PostTypeSchema.default(PostTypeEnum.Original),

  audience: PostAudienceSchema.default(PostAudience.Everyone),

  content: ContentSchema.default(''),

  content_type: ContentTypeSchema.default(ContentType.Short),

  parent_id: ObjectIdSchema.nullable().default(null),

  mentions: ObjectIdArraySchema.max(50).default([]),

  medias: MediaArraySchema.default([]),

  // Interaction counts
  guest_views: GuestViewsSchema.default(0),

  user_views: UserViewsSchema.default(0),

  reaction_count: ReactionCountSchema.default(0),

  reaction_counts: ReactionCountsSchema.default({
    Like: 0,
    Love: 0,
    Haha: 0,
    Wow: 0,
    Sad: 0,
    Angry: 0
  }),

  share_count: ShareCountSchema.default(0),

  comment_count: CommentCountSchema.default(0),

  bookmark_count: BookmarkCountSchema.default(0),

  // Soft delete
  is_deleted: IsDeletedSchema.default(false),

  deleted_at: DeletedAtSchema.nullable().default(null),

  delete_reason: DeleteReasonSchema.nullable().default(null),
  // Timestamps
  created_at: CreatedAtSchema.default(() => new Date()),

  updated_at: UpdatedAtSchema.default(() => new Date())
})

// Full schema with refinements
export const PostSchema = PostBaseSchema
  .refine((data) => {
    return data.content_type !== ContentType.Short || data.content.length <= 500
  }, { path: ['content'] })
  .refine((data) => {
    return !data.is_deleted || (data.deleted_at && data.delete_reason)
  }, { path: ['is_deleted'] })
  .refine((data) => {
    return data.is_deleted || (!data.deleted_at && !data.delete_reason)
  }, { path: ['is_deleted'] })

export const PostCreateSchema = PostBaseSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true
})

export const PostUpdateSchema = PostCreateSchema.partial().extend({
  _id: ObjectIdSchema,
  updated_at: UpdatedAtSchema.default(() => new Date())
})

export const PostPublicSchema = PostBaseSchema.omit({
  deleted_at: true,
  delete_reason: true
})

export type PostType = z.infer<typeof PostSchema>
export type PostCreateType = z.infer<typeof PostCreateSchema>
export type PostUpdateType = z.infer<typeof PostUpdateSchema>
export type PostPublicType = z.infer<typeof PostPublicSchema>
