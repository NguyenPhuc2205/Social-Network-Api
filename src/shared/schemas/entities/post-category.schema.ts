/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 11:01:17
 * @FilePath      : /server/src/shared/schemas/entities/post-category.schema.ts
 * @Description   : PostCategory schema validation for post category entity
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CategoryNameSchema,
  DescriptionSchema,
  URLSchema,
  CreatedAtSchema
} from '~/shared/schemas/primitives'

/**
 * PostCategory Base Schema - Entity for post categorization (without validations)
 * 
 * @description Defines the basic structure for post category entities representing hierarchical content classification.
 * Supports nested categories through parent-child relationships for organized content taxonomy.
 */
export const PostCategoryBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** Category name */
  name: CategoryNameSchema,

  /** Category description or explanation */
  description: DescriptionSchema.default(''),

  /** URL to category icon image */
  icon: URLSchema,

  /** ObjectId reference to parent category for hierarchy */
  parent_id: ObjectIdSchema.nullable().default(null),

  created_at: CreatedAtSchema.default(() => new Date())
})

/**
 * PostCategory Schema - Entity for post categorization (with validations)
 * 
 * @description Defines the complete structure for post category entities with business logic validations.
 * Ensures category hierarchy integrity and prevents circular references.
 */
export const PostCategorySchema = PostCategoryBaseSchema
  .refine((data) => {
    return data.name.trim().length > 0
  }, {
    message: 'Category name cannot be empty',
    path: ['name']
  })
  .refine((data) => {
    // Prevent self-reference
    return !data.parent_id || data._id.toString() !== data.parent_id.toString()
  }, {
    message: 'Category cannot be its own parent',
    path: ['parent_id']
  })

/**
 * PostCategory Create Schema - For creating new post category documents
 * 
 * @description Schema for post category creation operations. Excludes auto-generated fields
 * like _id and created_at which are handled by the database/application.
 * Uses BaseSchema to avoid refinement conflicts during creation.
 */
export const PostCategoryCreateSchema = PostCategoryBaseSchema.omit({
  _id: true,
  created_at: true
})

/**
 * PostCategory Update Schema - For updating existing post category documents
 * 
 * @description Schema for post category update operations. All fields are optional except _id
 * (to identify the category). Used for updating category details or hierarchy.
 * Uses BaseSchema for flexibility in partial updates.
 */
export const PostCategoryUpdateSchema = PostCategoryCreateSchema.partial().extend({
  _id: ObjectIdSchema
})

/**
 * Type Definitions for PostCategory Schemas
 */

/** 
 * PostCategory Base Type - Inferred from PostCategoryBaseSchema
 * @description Basic post category object type without validation constraints
 */
export type PostCategoryBaseType = z.infer<typeof PostCategoryBaseSchema>

/** 
 * PostCategory Type - Inferred from PostCategorySchema
 * @description Complete post category object type with validation constraints
 */
export type PostCategoryType = z.infer<typeof PostCategorySchema>

/** 
 * PostCategory Create Type - Inferred from PostCategoryCreateSchema
 * @description Type for creating new post categories (excludes auto-generated fields)
 */
export type PostCategoryCreateType = z.infer<typeof PostCategoryCreateSchema>

/** 
 * PostCategory Update Type - Inferred from PostCategoryUpdateSchema  
 * @description Type for updating existing post categories (all fields optional except _id)
 */
export type PostCategoryUpdateType = z.infer<typeof PostCategoryUpdateSchema>
