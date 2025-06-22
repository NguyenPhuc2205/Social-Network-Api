/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-21 19:36:02
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 19:50:47
 * @FilePath      : /server/src/shared/schemas/entities/role.schema.ts
 * @Description   : Role schema validation for role entity
 */

import { z } from 'zod'
import {
  ObjectIdSchema,
  RoleNameSchema,
  CreatedAtSchema,
  UpdatedAtSchema,
  DescriptionSchema
} from '~/shared/schemas/primitives'

/**
 * Role Base Schema - Entity for user roles (without validations)
 * 
 * @description Defines the basic structure for role entities representing user access levels and permissions.
 * Roles group related permissions together for easier user access management.
 */
export const RoleBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** Role name (Admin, Moderator, User, etc.) */
  name: RoleNameSchema,
  
  /** Description of the role and its responsibilities */
  description: DescriptionSchema.default(''),

  createdAt: CreatedAtSchema.default(() => new Date()),

  updatedAt: UpdatedAtSchema.default(() => new Date())
})

/**
 * Role Schema - Entity for user roles (with validations)
 * 
 * @description Defines the complete structure for role entities with business logic validations.
 * Ensures role name uniqueness and proper formatting.
 */
export const RoleSchema = RoleBaseSchema
  .refine((data) => {
    return data.name.trim().length > 0
  }, {
    message: 'Role name cannot be empty',
    path: ['name']
  })

/**
 * Role Create Schema - For creating new role documents
 * 
 * @description Schema for role creation operations. Excludes auto-generated fields
 * like _id, createdAt, and updatedAt which are handled by the database/application.
 * Uses BaseSchema to avoid refinement conflicts during creation.
 */
export const RoleCreateSchema = RoleBaseSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true
})

/**
 * Role Update Schema - For updating existing role documents
 * 
 * @description Schema for role update operations. All fields are optional except _id
 * (to identify the role) and updatedAt (automatically set). Used for updating role details.
 * Uses BaseSchema for flexibility in partial updates.
 */
export const RoleUpdateSchema = RoleCreateSchema.partial().extend({
  _id: ObjectIdSchema,
  updatedAt: UpdatedAtSchema.default(() => new Date())
})

/**
 * Type Definitions for Role Schemas
 */

/** 
 * Role Base Type - Inferred from RoleBaseSchema
 * @description Basic role object type without validation constraints
 */
export type RoleBaseType = z.infer<typeof RoleBaseSchema>

/** 
 * Role Type - Inferred from RoleSchema
 * @description Complete role object type with validation constraints
 */
export type RoleType = z.infer<typeof RoleSchema>

/** 
 * Role Create Type - Inferred from RoleCreateSchema
 * @description Type for creating new roles (excludes auto-generated fields)
 */
export type RoleCreateType = z.infer<typeof RoleCreateSchema>

/** 
 * Role Update Type - Inferred from RoleUpdateSchema  
 * @description Type for updating existing roles (all fields optional except _id)
 */
export type RoleUpdateType = z.infer<typeof RoleUpdateSchema>
