/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-09 18:02:01
 * @FilePath      : /server/src/infrastructure/database/interfaces/permission.interface.ts
 * @Description   : Permission interface for MongoDB Native Driver
 */

import { BaseSchema } from '~/core/bases/base.schema'

/**
 * Permission interface for managing granular permissions and access control
 * 
 * @interface IPermission
 * @extends BaseSchema
 * @property {string} name - Unique permission name (e.g., 'create_post', 'delete_user')
 * @property {string} description - Optional detailed description of what the permission allows
 * @property {string} resource - Target resource type (e.g., 'post', 'user', 'message', 'group')
 * @property {string} action - Specific action allowed (e.g., 'create', 'read', 'update', 'delete')
 */
export interface IPermission extends BaseSchema {
  /** Unique permission name (e.g., 'create_post', 'delete_user') */
  name: string
  /** Optional detailed description of what the permission allows */
  description?: string
  /** Target resource type (e.g., 'post', 'user', 'message', 'group') */
  resource: string
  /** Specific action allowed (e.g., 'create', 'read', 'update', 'delete') */
  action: string
}
