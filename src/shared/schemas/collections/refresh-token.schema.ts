/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/entities/refresh-token.schema.ts
 * @Description   : RefreshToken schema validation for refresh_token entity
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  DeviceIdSchema,
  RefreshTokenSchema as TokenSchema,
  ExpiresAtSchema,
  CreatedAtSchema
} from '~/shared/schemas/primitives'

/**
 * RefreshToken Base Schema - Entity for JWT refresh tokens (without validations)
 * 
 * @description Defines the basic structure for refresh token entities used in JWT authentication.
 * Stores refresh tokens with their expiration and device information for secure session management.
 */
export const RefreshTokenBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** ObjectId reference to the token owner */
  user_id: ObjectIdSchema,

  /** Device identifier for token association */
  device_id: DeviceIdSchema,

  /** ObjectId reference to the user session */
  session_id: ObjectIdSchema,

  /** JWT refresh token string */
  token: TokenSchema,

  /** Expiration timestamp for the token */
  expires_at: ExpiresAtSchema,

  created_at: CreatedAtSchema.default(() => new Date()),

  updated_at: CreatedAtSchema.default(() => new Date())
})

/**
 * RefreshToken Schema - Entity for JWT refresh tokens (with validations)
 * 
 * @description Defines the complete structure for refresh token entities with business logic validations.
 * Ensures token expiration logic and security constraints.
 */
export const RefreshTokenSchema = RefreshTokenBaseSchema
  .refine((data) => {
    return data.expires_at > new Date()
  }, {
    message: 'Token expiration date must be in the future',
    path: ['expires_at']
  })

/**
 * RefreshToken Create Schema - For creating new refresh token documents
 * 
 * @description Schema for refresh token creation operations. Excludes auto-generated fields
 * like _id, created_at, and updated_at which are handled by the database/application.
 * Uses BaseSchema to avoid refinement conflicts during creation.
 */
export const RefreshTokenCreateSchema = RefreshTokenBaseSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true  
})

/**
 * RefreshToken Update Schema - For updating existing refresh token documents
 * 
 * @description Schema for refresh token update operations. All fields are optional except _id
 * (to identify the token). Used for token rotation and expiration updates.
 * Uses BaseSchema for flexibility in partial updates.
 */
export const RefreshTokenUpdateSchema = RefreshTokenCreateSchema.partial().extend({
  _id: ObjectIdSchema,
  updated_at: CreatedAtSchema.default(() => new Date())
})

/**
 * Type Definitions for RefreshToken Schemas
 */

/** 
 * RefreshToken Base Type - Inferred from RefreshTokenBaseSchema
 * @description Basic refresh token object type without validation constraints
 */
export type RefreshTokenBaseType = z.infer<typeof RefreshTokenBaseSchema>

/** 
 * RefreshToken Type - Inferred from RefreshTokenSchema
 * @description Complete refresh token object type with validation constraints
 */
export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>

/** 
 * RefreshToken Create Type - Inferred from RefreshTokenCreateSchema
 * @description Type for creating new refresh tokens (excludes auto-generated fields)
 */
export type RefreshTokenCreateType = z.infer<typeof RefreshTokenCreateSchema>

/** 
 * RefreshToken Update Type - Inferred from RefreshTokenUpdateSchema
 * @description Type for updating existing refresh tokens (all fields optional except _id)
 */
export type RefreshTokenUpdateType = z.infer<typeof RefreshTokenUpdateSchema>
