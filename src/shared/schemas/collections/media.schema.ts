/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/entities/media.schema.ts
 * @Description   : Media schema validation for media entity
 */

import { z } from 'zod'
import { 
  ObjectIdSchema,
  URLSchema,
  MediaTypeSchema,
  FileSizeSchema,
  MediaDimensionsJsonSchema,
  CreatedAtSchema
} from '~/shared/schemas/primitives'

/**
 * Media Base Schema - Entity for media file information (without validations)
 * 
 * @description Defines the basic structure for media entities representing uploaded files (images, videos, etc.).
 * Stores file metadata including URL, type, size, and dimensions for content management.
 */
export const MediaBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** URL location of the uploaded media file */
  url: URLSchema,

  /** Media type (image, video, audio, document, etc.) */
  type: MediaTypeSchema,

  /** File size in bytes */
  size: FileSizeSchema.default(0),

  /** JSON object containing width, height, duration metadata */
  media_dimensions: MediaDimensionsJsonSchema.nullable().default(null),

  created_at: CreatedAtSchema.default(() => new Date())
})

/**
 * Media Schema - Entity for media file information (with validations)
 * 
 * @description Defines the complete structure for media entities with business logic validations.
 * Ensures media URL validity and proper file size constraints.
 */
export const MediaSchema = MediaBaseSchema
  .refine((data) => {
    return data.size >= 0
  }, {
    message: 'File size must be non-negative',
    path: ['size']
  })
  .refine((data) => {
    return data.url.length > 0
  }, {
    message: 'Media URL cannot be empty',
    path: ['url']
  })

/**
 * Media Create Schema - For creating new media documents
 * 
 * @description Schema for media creation operations. Excludes auto-generated fields
 * like _id and created_at which are handled by the database/application.
 * Uses BaseSchema to avoid refinement conflicts during creation.
 */
export const MediaCreateSchema = MediaBaseSchema.omit({
  _id: true,
  created_at: true
})

/**
 * Media Update Schema - For updating existing media documents
 * 
 * @description Schema for media update operations. All fields are optional except _id
 * (to identify the media). Typically used for updating metadata or dimensions.
 * Uses BaseSchema for flexibility in partial updates.
 */
export const MediaUpdateSchema = MediaCreateSchema.partial().extend({
  _id: ObjectIdSchema
})

/**
 * Type Definitions for Media Schemas
 */

/** 
 * Media Base Type - Inferred from MediaBaseSchema
 * @description Basic media object type without validation constraints
 */
export type MediaBaseType = z.infer<typeof MediaBaseSchema>

/** 
 * Media Type - Inferred from MediaSchema
 * @description Complete media object type with validation constraints
 */
export type MediaType = z.infer<typeof MediaSchema>

/** 
 * Media Create Type - Inferred from MediaCreateSchema
 * @description Type for creating new media (excludes auto-generated fields)
 */
export type MediaCreateType = z.infer<typeof MediaCreateSchema>

/** 
 * Media Update Type - Inferred from MediaUpdateSchema  
 * @description Type for updating existing media (all fields optional except _id)
 */
export type MediaUpdateType = z.infer<typeof MediaUpdateSchema>
