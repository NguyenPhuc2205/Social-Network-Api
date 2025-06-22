/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/refresh-token.interface.ts
 * @Description   : Refresh token interface for MongoDB Native Driver
 */
import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'

/**
 * Refresh token interface for managing JWT refresh tokens and authentication
 * 
 * @interface IRefreshToken
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who owns this token
 * @property {ObjectId} session_id - Session ID for device-specific token management
 * @property {string} device_id - Device identifier for device-specific tokens
 * @property {string} token - Unique refresh token string for authentication
 * @property {Date} expires_at - Token expiration date and time
 */
export interface IRefreshToken extends BaseSchema {
  /** ID of the user who owns this token */
  user_id: ObjectId // Reference to User._id
  /** Session ID for device-specific token management */
  session_id: ObjectId
  /** Device identifier for device-specific tokens */
  device_id: string

  /** Unique refresh token string for authentication */
  token: string
  /** Token expiration date and time */
  expires_at: Date
}
