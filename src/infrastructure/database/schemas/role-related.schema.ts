/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-09 18:02:01
 * @FilePath      : /server/src/infrastructure/database/schemas/role-related.schema.ts
 * @Description   : Role and permission schemas for MongoDB Native Driver
 */
import { ObjectId } from "mongodb"
import { BaseSchema } from "~/core/bases/base.schemas"

/**
 * Role schema for managing user roles and access levels
 * 
 * @interface IRoleSchema
 * @extends BaseSchema
 * @property {string} name - Unique role name (e.g., 'admin', 'moderator', 'user')
 * @property {string} description - Optional detailed description of the role's purpose
 */
export interface IRoleSchema extends BaseSchema {
  /** Unique role name (e.g., 'admin', 'moderator', 'user') */
  name: string
  /** Optional detailed description of the role's purpose */
  description?: string
}

/**
 * Permission schema for managing granular permissions and access control
 * 
 * @interface IPermissionSchema
 * @extends BaseSchema
 * @property {string} name - Unique permission name (e.g., 'create_post', 'delete_user')
 * @property {string} description - Optional detailed description of what the permission allows
 * @property {string} resource - Target resource type (e.g., 'post', 'user', 'message', 'group')
 * @property {string} action - Specific action allowed (e.g., 'create', 'read', 'update', 'delete')
 */
export interface IPermissionSchema extends BaseSchema {
  /** Unique permission name (e.g., 'create_post', 'delete_user') */
  name: string
  /** Optional detailed description of what the permission allows */
  description?: string
  /** Target resource type (e.g., 'post', 'user', 'message', 'group') */
  resource: string
  /** Specific action allowed (e.g., 'create', 'read', 'update', 'delete') */
  action: string
}

/**
 * Role-Permission relationship schema for many-to-many association
 * 
 * @interface IRolePermissionSchema
 * @extends BaseSchema
 * @property {ObjectId} role_id - Reference to the role
 * @property {ObjectId} permission_id - Reference to the permission
 */
export interface IRolePermissionSchema extends BaseSchema {
  /** Reference to the role */
  role_id: ObjectId
  /** Reference to the permission */
  permission_id: ObjectId
}
