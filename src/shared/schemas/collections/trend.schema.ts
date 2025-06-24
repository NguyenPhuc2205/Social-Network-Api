/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/entities/trend.schema.ts
 * @Description   : Trend schema validation for trend entity
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  TrendNameSchema,
  PostCountSchema,
  TrendScoreSchema,
  GeoPointSchema,
  CreatedAtSchema,
  UpdatedAtSchema
} from '~/shared/schemas/primitives'

/**
 * Trend Base Schema - Entity for trending topics and hashtags (without validations)
 * 
 * @description Defines the basic structure for trend entities representing popular content and topics.
 * Tracks trending hashtags with their performance metrics and geographic data for analytics.
 */
export const TrendBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** Trend name or topic */
  name: TrendNameSchema,

  /** ObjectId reference to associated hashtag */
  hashtag_id: ObjectIdSchema.nullable().default(null),

  /** Number of posts related to this trend */
  post_count: PostCountSchema.default(0),

  /** Calculated trending score based on engagement */
  trend_score: TrendScoreSchema.default(0),

  /** Geographic location where trend is popular */
  location: GeoPointSchema.nullable().default(null),

  created_at: CreatedAtSchema.default(() => new Date()),

  updated_at: UpdatedAtSchema.default(() => new Date())
})

/**
 * Trend Schema - Entity for trending topics and hashtags (with validations)
 * 
 * @description Defines the complete structure for trend entities with business logic validations.
 * Ensures trend metrics validity and proper score calculations.
 */
export const TrendSchema = TrendBaseSchema
  .refine((data) => {
    return data.post_count >= 0
  }, {
    message: 'Post count must be non-negative',
    path: ['post_count']
  })
  .refine((data) => {
    return data.trend_score >= 0
  }, {
    message: 'Trend score must be non-negative',
    path: ['trend_score']
  })

/**
 * Trend Create Schema - For creating new trend documents
 * 
 * @description Schema for trend creation operations. Excludes auto-generated fields
 * like _id, created_at, and updated_at which are handled by the database/application.
 * Uses BaseSchema to avoid refinement conflicts during creation.
 */
export const TrendCreateSchema = TrendBaseSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true
})

/**
 * Trend Update Schema - For updating existing trend documents
 * 
 * @description Schema for trend update operations. All fields are optional except _id
 * (to identify the trend). Used for updating trend metrics and scores.
 * Uses BaseSchema for flexibility in partial updates.
 */
export const TrendUpdateSchema = TrendCreateSchema.partial().extend({
  _id: ObjectIdSchema,
  updated_at: UpdatedAtSchema.default(() => new Date())
})

/**
 * Type Definitions for Trend Schemas
 */

/** 
 * Trend Base Type - Inferred from TrendBaseSchema
 * @description Basic trend object type without validation constraints
 */
export type TrendBaseType = z.infer<typeof TrendBaseSchema>

/** 
 * Trend Type - Inferred from TrendSchema
 * @description Complete trend object type with validation constraints
 */
export type TrendType = z.infer<typeof TrendSchema>

/** 
 * Trend Create Type - Inferred from TrendCreateSchema
 * @description Type for creating new trends (excludes auto-generated fields)
 */
export type TrendCreateType = z.infer<typeof TrendCreateSchema>

/** 
 * Trend Update Type - Inferred from TrendUpdateSchema
 * @description Type for updating existing trends (all fields optional except _id)
 */
export type TrendUpdateType = z.infer<typeof TrendUpdateSchema>
