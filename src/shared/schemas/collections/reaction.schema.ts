/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/entities/reaction.schema.ts
 * @Description   : Reaction schema validation for reaction entity
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  ReactionTypeSchema,
  CreatedAtSchema
} from '~/shared/schemas/primitives'
import { ReactionType as ReactionTypeEnum } from '~/shared/enums'

/**
 * Reaction Base Schema - Entity for user post reactions (without validations)
 * 
 * @description Defines the basic structure for reaction entities representing user responses to posts.
 * Tracks different types of reactions (Like, Love, Haha, Wow, Sad, Angry) with user and post associations.
 */
export const ReactionBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** ObjectId reference to the user who reacted */
  user_id: ObjectIdSchema,

  /** ObjectId reference to the post being reacted to */
  post_id: ObjectIdSchema,

  /** Type of reaction (Like, Love, Haha, Wow, Sad, Angry) */
  type: ReactionTypeSchema.default(ReactionTypeEnum.Like),

  created_at: CreatedAtSchema.default(() => new Date())
})

/**
 * Reaction Schema - Entity for user post reactions (with validations)
 * 
 * @description Defines the complete structure for reaction entities with business logic validations.
 * Ensures reaction integrity and prevents duplicate reactions.
 */
export const ReactionSchema = ReactionBaseSchema
  .refine((data) => {
    return data.user_id.toString() !== data.post_id.toString()
  }, {
    message: 'User ID and Post ID must be different valid ObjectIds',
    path: ['user_id', 'post_id']
  })

/**
 * Reaction Create Schema - For creating new reaction documents
 * 
 * @description Schema for reaction creation operations. Excludes auto-generated fields
 * like _id and created_at which are handled by the database/application.
 * Uses BaseSchema to avoid refinement conflicts during creation.
 */
export const ReactionCreateSchema = ReactionBaseSchema.omit({
  _id: true,
  created_at: true
})

/**
 * Reaction Update Schema - For updating existing reaction documents
 * 
 * @description Schema for reaction update operations. All fields are optional except _id
 * (to identify the reaction). Typically used for changing reaction type.
 * Uses BaseSchema for flexibility in partial updates.
 */
export const ReactionUpdateSchema = ReactionCreateSchema.partial().extend({
  _id: ObjectIdSchema
})

/**
 * Type Definitions for Reaction Schemas
 */
/** 
 * Reaction Base Type - Inferred from ReactionBaseSchema
 * @description Basic reaction object type without validation constraints
 */
export type ReactionBaseType = z.infer<typeof ReactionBaseSchema>

/**
 * Reaction Create Type - Inferred from ReactionCreateSchema
 * @description Type for creating new reactions (excludes auto-generated fields)
 */
export type ReactionCreateType = z.infer<typeof ReactionCreateSchema>

/** 
 * Reaction Update Type - Inferred from ReactionUpdateSchema  
 * @description Type for updating existing reactions (all fields optional except _id)
 */
export type ReactionUpdateType = z.infer<typeof ReactionUpdateSchema>
