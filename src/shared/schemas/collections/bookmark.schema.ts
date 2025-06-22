/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/entities/bookmark.schema.ts
 * @Description   : Bookmark schema validation for bookmark entity
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema,
  UpdatedAtSchema
} from '~/shared/schemas/primitives'

/**
 * Bookmark Base Schema - Entity for user post bookmarks (without validations)
 * 
 * @description Defines the basic structure for bookmark entities representing saved posts by users.
 * Simple relationship entity that tracks which user bookmarked which post with timestamps.
 */
export const BookmarkBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** ObjectId reference to the user who created the bookmark */
  user_id: ObjectIdSchema,

  /** ObjectId reference to the bookmarked post */
  post_id: ObjectIdSchema,

  created_at: CreatedAtSchema.default(() => new Date()),

  updated_at: UpdatedAtSchema.default(() => new Date())
})

/**
 * Bookmark Schema - Entity for user post bookmarks (with validations)
 * 
 * @description Defines the complete structure for bookmark entities with business logic validations.
 * Ensures bookmark integrity and prevents duplicate bookmarks.
 */
export const BookmarkSchema = BookmarkBaseSchema
  .refine((data) => {
    return data.user_id.toString() !== '' && data.post_id.toString() !== ''
  }, {
    message: 'User ID and Post ID must be valid ObjectIds',
    path: ['user_id', 'post_id']
  })

/**
 * Bookmark Create Schema - For creating new bookmark documents
 * 
 * @description Schema for bookmark creation operations. Excludes auto-generated fields
 * like _id, created_at, and updated_at which are handled by the database/application.
 * Uses BaseSchema to avoid refinement conflicts during creation.
 */
export const BookmarkCreateSchema = BookmarkBaseSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true
})

/**
 * Bookmark Update Schema - For updating existing bookmark documents
 * 
 * @description Schema for bookmark update operations. All fields are optional except _id
 * (to identify the bookmark). Limited update scenarios for bookmark entities.
 * Uses BaseSchema for flexibility in partial updates.
 */
export const BookmarkUpdateSchema = BookmarkCreateSchema.partial().extend({
  _id: ObjectIdSchema,
  updated_at: UpdatedAtSchema.default(() => new Date())
})

/**
 * Type Definitions for Bookmark Schemas
 */

/** 
 * Bookmark Base Type - Inferred from BookmarkBaseSchema
 * @description Basic bookmark object type without validation constraints
 */
export type BookmarkBaseType = z.infer<typeof BookmarkBaseSchema>

/** 
 * Bookmark Type - Inferred from BookmarkSchema
 * @description Complete bookmark object type with validation constraints
 */
export type BookmarkType = z.infer<typeof BookmarkSchema>

/** 
 * Bookmark Create Type - Inferred from BookmarkCreateSchema
 * @description Type for creating new bookmarks (excludes auto-generated fields)
 */
export type BookmarkCreateType = z.infer<typeof BookmarkCreateSchema>

/** 
 * Bookmark Update Type - Inferred from BookmarkUpdateSchema  
 * @description Type for updating existing bookmarks (all fields optional except _id)
 */
export type BookmarkUpdateType = z.infer<typeof BookmarkUpdateSchema>
