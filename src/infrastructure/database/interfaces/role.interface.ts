/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-09 18:02:01
 * @FilePath      : /server/src/infrastructure/database/interfaces/role.interface.ts
 * @Description   : Role interface for MongoDB Native Driver
 */

import { BaseSchema } from '~/core/bases/base.schema'

/**
 * Role interface for managing user roles and access levels
 * 
 * @interface IRole
 * @extends BaseSchema
 * @property {string} name - Unique role name (e.g., 'admin', 'moderator', 'user')
 * @property {string} description - Optional detailed description of the role's purpose
 */
export interface IRole extends BaseSchema {
  /** Unique role name (e.g., 'admin', 'moderator', 'user') */
  name: string
  /** Optional detailed description of the role's purpose */
  description?: string
}
