/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/entities/post-post-category.schema.ts
 * @Description   : PostPostCategory schema validation for post-postCategory relation entity
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema
} from '~/shared/schemas/primitives'

/**
 * PostPostCategory Base Schema - Junction entity for post-category relationships (without validations)
 * 
 * @description Defines the basic structure for post-category relationship entities representing many-to-many
 * associations between posts and categories. Enables category-based post organization and filtering.
 */
export const PostPostCategoryBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** ObjectId reference to the post */
  post_id: ObjectIdSchema,

  /** ObjectId reference to the category */
  category_id: ObjectIdSchema,

  created_at: CreatedAtSchema.default(() => new Date())
})

/**
 * PostPostCategory Schema - Junction entity for post-category relationships (with validations)
 * 
 * @description Defines the complete structure for post-category relationship entities with business logic validations.
 * Ensures valid relationship between posts and categories.
 */
export const PostPostCategorySchema = PostPostCategoryBaseSchema
  .refine((data) => {
    return data.post_id.toString() !== data.category_id.toString()
  }, {
    message: 'Post ID and Category ID must be different valid ObjectIds',
    path: ['post_id', 'category_id']
  })

/**
 * PostPostCategory Create Schema - For creating new post-category relationships
 * 
 * @description Schema for post-category creation operations. Excludes auto-generated fields
 * like _id and created_at which are handled by the database/application.
 * Uses BaseSchema to avoid refinement conflicts during creation.
 */
export const PostPostCategoryCreateSchema = PostPostCategoryBaseSchema.omit({
  _id: true,
  created_at: true
})

/**
 * PostPostCategory Update Schema - For updating existing post-category relationships
 * 
 * @description Schema for post-category update operations. All fields are optional except _id
 * (to identify the relationship). Limited update scenarios for junction entities.
 * Uses BaseSchema for flexibility in partial updates.
 */
export const PostPostCategoryUpdateSchema = PostPostCategoryCreateSchema.partial().extend({
  _id: ObjectIdSchema
})

/**
 * Type Definitions for PostPostCategory Schemas
 */

/** 
 * PostPostCategory Base Type - Inferred from PostPostCategoryBaseSchema
 * @description Basic post-category relationship object type without validation constraints
 */
export type PostPostCategoryBaseType = z.infer<typeof PostPostCategoryBaseSchema>

/** 
 * PostPostCategory Type - Inferred from PostPostCategorySchema
 * @description Complete post-category relationship object type with validation constraints
 */
export type PostPostCategoryType = z.infer<typeof PostPostCategorySchema>

/** 
 * PostPostCategory Create Type - Inferred from PostPostCategoryCreateSchema
 * @description Type for creating new post-category relationships (excludes auto-generated fields)
 */
export type PostPostCategoryCreateType = z.infer<typeof PostPostCategoryCreateSchema>

/** 
 * PostPostCategory Update Type - Inferred from PostPostCategoryUpdateSchema  
 * @description Type for updating existing post-category relationships (all fields optional except _id)
 */
export type PostPostCategoryUpdateType = z.infer<typeof PostPostCategoryUpdateSchema>
