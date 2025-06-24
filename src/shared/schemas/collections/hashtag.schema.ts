/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/entities/hashtag.schema.ts
 * @Description   : Hashtag schema validation for hashtag entity
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  HashtagSchema as HashtagNameSchema,
  HashtagPostCountSchema,
  CreatedAtSchema
} from '~/shared/schemas/primitives'

/**
 * Hashtag Base Schema - Entity for hashtag information (without validations)
 * 
 * @description Defines the basic structure for hashtag entities representing trending topics and post categorization.
 * Tracks hashtag names with their usage statistics for trend analysis.
 */
export const HashtagBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** Hashtag name (unique, without # symbol) */
  name: HashtagNameSchema,

  /** Number of posts using this hashtag */
  post_count: HashtagPostCountSchema.default(0),

  created_at: CreatedAtSchema.default(() => new Date())
})

/**
 * Hashtag Schema - Entity for hashtag information (with validations)
 * 
 * @description Defines the complete structure for hashtag entities with business logic validations.
 * Ensures hashtag name uniqueness and proper formatting.
 */
export const HashtagSchema = HashtagBaseSchema
  .refine((data) => {
    return data.name.length > 0 && !data.name.startsWith('#')
  }, {
    message: 'Hashtag name must not be empty and should not start with #',
    path: ['name']
  })

/**
 * Hashtag Create Schema - For creating new hashtag documents
 * 
 * @description Schema for hashtag creation operations. Excludes auto-generated fields
 * like _id and created_at which are handled by the database/application.
 * Uses BaseSchema to avoid refinement conflicts during creation.
 */
export const HashtagCreateSchema = HashtagBaseSchema.omit({
  _id: true,
  created_at: true
})

/**
 * Hashtag Update Schema - For updating existing hashtag documents
 * 
 * @description Schema for hashtag update operations. All fields are optional except _id
 * (to identify the hashtag). Typically used for updating post counts.
 * Uses BaseSchema for flexibility in partial updates.
 */
export const HashtagUpdateSchema = HashtagCreateSchema.partial().extend({
  _id: ObjectIdSchema
})

/**
 * Type Definitions for Hashtag Schemas
 */

/** 
 * Hashtag Base Type - Inferred from HashtagBaseSchema
 * @description Basic hashtag object type without validation constraints
 */
export type HashtagBaseType = z.infer<typeof HashtagBaseSchema>

/** 
 * Hashtag Type - Inferred from HashtagSchema
 * @description Complete hashtag object type with validation constraints
 */
export type HashtagType = z.infer<typeof HashtagSchema>

/** 
 * Hashtag Create Type - Inferred from HashtagCreateSchema
 * @description Type for creating new hashtags (excludes auto-generated fields)
 */
export type HashtagCreateType = z.infer<typeof HashtagCreateSchema>

/** 
 * Hashtag Update Type - Inferred from HashtagUpdateSchema  
 * @description Type for updating existing hashtags (all fields optional except _id)
 */
export type HashtagUpdateType = z.infer<typeof HashtagUpdateSchema>
