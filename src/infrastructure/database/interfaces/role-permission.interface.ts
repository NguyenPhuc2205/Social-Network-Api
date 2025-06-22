/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 21:39:41
 * @FilePath      : /server/src/infrastructure/database/interfaces/role-permission.interface.ts
 * @Description   : Role-Permission interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'

/**
 * Role-Permission relationship interface for many-to-many association
 * 
 * @interface IRolePermission
 * @extends BaseSchema
 * @property {ObjectId} role_id - Reference to the role
 * @property {ObjectId} permission_id - Reference to the permission
 */
export interface IRolePermission extends BaseSchema {
  /** Reference to the role */
  role_id: ObjectId
  /** Reference to the permission */
  permission_id: ObjectId
}
