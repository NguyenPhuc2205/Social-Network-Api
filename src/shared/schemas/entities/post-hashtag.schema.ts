/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/entities/post-hashtag.schema.ts
 * @Description   : PostHashtag schema validation for post-hashtag relation entity
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema
} from '~/shared/schemas/primitives'

/**
 * PostHashtag Base Schema - Junction entity for post-hashtag relationships (without validations)
 * 
 * @description Defines the basic structure for post-hashtag relationship entities representing many-to-many
 * associations between posts and hashtags. Enables hashtag-based post categorization and search.
 */
export const PostHashtagBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** ObjectId reference to the post */
  post_id: ObjectIdSchema,

  /** ObjectId reference to the hashtag */
  hashtag_id: ObjectIdSchema,

  created_at: CreatedAtSchema.default(() => new Date())
})

/**
 * PostHashtag Schema - Junction entity for post-hashtag relationships (with validations)
 * 
 * @description Defines the complete structure for post-hashtag relationship entities with business logic validations.
 * Ensures valid relationship between posts and hashtags.
 */
export const PostHashtagSchema = PostHashtagBaseSchema
  .refine((data) => {
    return data.post_id.toString() !== data.hashtag_id.toString()
  }, {
    message: 'Post ID and Hashtag ID must be different valid ObjectIds',
    path: ['post_id', 'hashtag_id']
  })

/**
 * PostHashtag Create Schema - For creating new post-hashtag relationships
 * 
 * @description Schema for post-hashtag creation operations. Excludes auto-generated fields
 * like _id and created_at which are handled by the database/application.
 * Uses BaseSchema to avoid refinement conflicts during creation.
 */
export const PostHashtagCreateSchema = PostHashtagBaseSchema.omit({
  _id: true,
  created_at: true
})

/**
 * PostHashtag Update Schema - For updating existing post-hashtag relationships
 * 
 * @description Schema for post-hashtag update operations. All fields are optional except _id
 * (to identify the relationship). Limited update scenarios for junction entities.
 * Uses BaseSchema for flexibility in partial updates.
 */
export const PostHashtagUpdateSchema = PostHashtagCreateSchema.partial().extend({
  _id: ObjectIdSchema
})

/**
 * Type Definitions for PostHashtag Schemas
 */

/** 
 * PostHashtag Base Type - Inferred from PostHashtagBaseSchema
 * @description Basic post-hashtag relationship object type without validation constraints
 */
export type PostHashtagBaseType = z.infer<typeof PostHashtagBaseSchema>

/** 
 * PostHashtag Type - Inferred from PostHashtagSchema
 * @description Complete post-hashtag relationship object type with validation constraints
 */
export type PostHashtagType = z.infer<typeof PostHashtagSchema>

/** 
 * PostHashtag Create Type - Inferred from PostHashtagCreateSchema
 * @description Type for creating new post-hashtag relationships (excludes auto-generated fields)
 */
export type PostHashtagCreateType = z.infer<typeof PostHashtagCreateSchema>

/** 
 * PostHashtag Update Type - Inferred from PostHashtagUpdateSchema  
 * @description Type for updating existing post-hashtag relationships (all fields optional except _id)
 */
export type PostHashtagUpdateType = z.infer<typeof PostHashtagUpdateSchema>
