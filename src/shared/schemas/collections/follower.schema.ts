/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 10:13:37
 * @FilePath      : /server/src/shared/schemas/entities/follower.schema.ts
 * @Description   : Follower schema validation for follower entity
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  CreatedAtSchema
} from '~/shared/schemas/primitives'

/**
 * Follower Base Schema - Entity for user following relationships (without validations)
 * 
 * @description Defines the basic structure for follower entities representing follow relationships between users.
 * Tracks who follows whom with creation timestamp only (follows are permanent records).
 */
export const FollowerBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** ObjectId reference to the user who is following */
  user_id: ObjectIdSchema,

  /** ObjectId reference to the user being followed */
  followed_user_id: ObjectIdSchema,

  created_at: CreatedAtSchema.default(() => new Date())
})

/**
 * Follower Schema - Entity for user following relationships (with validations)
 * 
 * @description Defines the complete structure for follower entities with business logic validations.
 * Ensures users cannot follow themselves and maintains referential integrity.
 */
export const FollowerSchema = FollowerBaseSchema
  .refine((data) => {
    return data.user_id.toString() !== data.followed_user_id.toString()
  }, {
    message: 'Users cannot follow themselves',
    path: ['followed_user_id']
  })

/**
 * Follower Create Schema - For creating new follower relationships
 * 
 * @description Schema for follower creation operations. Excludes auto-generated fields
 * like _id and created_at which are handled by the database/application.
 * Uses BaseSchema to avoid refinement conflicts during creation.
 */
export const FollowerCreateSchema = FollowerBaseSchema.omit({
  _id: true,
  created_at: true
})

/**
 * Follower Update Schema - For updating existing follower relationships
 * 
 * @description Schema for follower update operations. All fields are optional except _id
 * (to identify the relationship). Limited update scenarios for follower entities.
 * Uses BaseSchema for flexibility in partial updates.
 */
export const FollowerUpdateSchema = FollowerCreateSchema.partial().extend({
  _id: ObjectIdSchema
})

/**
 * Type Definitions for Follower Schemas
 */

/** 
 * Follower Base Type - Inferred from FollowerBaseSchema
 * @description Basic follower relationship object type without validation constraints
 */
export type FollowerBaseType = z.infer<typeof FollowerBaseSchema>

/** 
 * Follower Type - Inferred from FollowerSchema
 * @description Complete follower relationship object type with validation constraints
 */
export type FollowerType = z.infer<typeof FollowerSchema>

/** 
 * Follower Create Type - Inferred from FollowerCreateSchema
 * @description Type for creating new follower relationships (excludes auto-generated fields)
 */
export type FollowerCreateType = z.infer<typeof FollowerCreateSchema>

/** 
 * Follower Update Type - Inferred from FollowerUpdateSchema  
 * @description Type for updating existing follower relationships (all fields optional except _id)
 */
export type FollowerUpdateType = z.infer<typeof FollowerUpdateSchema>
