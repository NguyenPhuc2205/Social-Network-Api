/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-21 20:21:16
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 20:44:39
 * @FilePath      : /server/src/shared/schemas/entities/role-permision.schema.ts
 * @Description   : Role-Permission schema validation for role-permission entity
 */

import { z } from 'zod'
import { CreatedAtSchema, ObjectIdSchema } from '~/shared/schemas/primitives'

/**
 * RolePermission Base Schema - Junction entity for role-permission relationships (without validations)
 * 
 * @description Defines the basic structure for role-permission relationship entities representing many-to-many
 * associations between roles and permissions. Enables flexible role-based access control (RBAC).
 */
export const RolePermissionBaseSchema = z.object({
  _id: ObjectIdSchema,

  /** ObjectId reference to the role */
  role_id: ObjectIdSchema,

  /** ObjectId reference to the permission */
  permission_id: ObjectIdSchema,

  created_at: CreatedAtSchema.default(() => new Date())
})

/**
 * RolePermission Schema - Junction entity for role-permission relationships (with validations)
 * 
 * @description Defines the complete structure for role-permission relationship entities with business logic validations.
 * Ensures valid relationships between roles and permissions.
 */
export const RolePermissionSchema = RolePermissionBaseSchema
  .refine((data) => {
    return data.role_id.toString() !== data.permission_id.toString()
  }, {
    message: 'Role ID and Permission ID must be different valid ObjectIds',
    path: ['role_id', 'permission_id']
  })

/**
 * RolePermission Create Schema - For creating new role-permission relationships
 * 
 * @description Schema for role-permission creation operations. Excludes auto-generated fields
 * like _id and created_at which are handled by the database/application.
 * Uses BaseSchema to avoid refinement conflicts during creation.
 */
export const RolePermissionCreateSchema = RolePermissionBaseSchema.omit({
  _id: true,
  created_at: true
})

/**
 * RolePermission Update Schema - For updating existing role-permission relationships
 * 
 * @description Schema for role-permission update operations. All fields are optional except _id
 * (to identify the relationship). Limited update scenarios for junction entities.
 * Uses BaseSchema for flexibility in partial updates.
 */
export const RolePermissionUpdateSchema = RolePermissionCreateSchema.partial().extend({
  _id: ObjectIdSchema,
})

/**
 * Type Definitions for RolePermission Schemas
 */

/** 
 * RolePermission Base Type - Inferred from RolePermissionBaseSchema
 * @description Basic role-permission relationship object type without validation constraints
 */
export type RolePermissionBaseType = z.infer<typeof RolePermissionBaseSchema>

/** 
 * RolePermission Type - Inferred from RolePermissionSchema
 * @description Complete role-permission relationship object type with validation constraints
 */
export type RolePermissionType = z.infer<typeof RolePermissionSchema>

/** 
 * RolePermission Create Type - Inferred from RolePermissionCreateSchema
 * @description Type for creating new role-permission relationships (excludes auto-generated fields)
 */
export type RolePermissionCreateType = z.infer<typeof RolePermissionCreateSchema>

/** 
 * RolePermission Update Type - Inferred from RolePermissionUpdateSchema  
 * @description Type for updating existing role-permission relationships (all fields optional except _id)
 */
export type RolePermissionUpdateType = z.infer<typeof RolePermissionUpdateSchema>
