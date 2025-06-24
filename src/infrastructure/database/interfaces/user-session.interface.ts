/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/user-session.interface.ts
 * @Description   : User session interface for MongoDB Native Driver
 */
import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { ILoginHistory } from '~/shared/interfaces'

/**
 * User session interface for managing user sessions and device tracking
 * 
 * @interface IUserSession
 * @extends BaseSchema
 * @property {ObjectId} user_id - ID of the user who owns this session
 * @property {string} device_id - Unique identifier for the device
 * @property {string} device_info - Optional browser/device information string
 * @property {string} device_name - Optional user-friendly name for the device
 * @property {string} platform - Optional platform identifier (iOS, Android, Web, Desktop)
 * @property {string} user_agent - Optional full user agent string from the browser
 * @property {string} browser - Optional browser name (Chrome, Safari, Firefox, etc.)
 * @property {string} os - Optional operating system (Windows, macOS, Linux, iOS, Android)
 * @property {string} ip_address - Optional IP address for the session
 * @property {boolean} is_active - Whether the session is currently active
 * @property {Date} last_activity - Timestamp of the last activity in this session
 * @property {ILoginHistory[]} login_history - Array of login histories with timestamps and IP addresses
 */
export interface IUserSession extends BaseSchema {
  /** ID of the user who owns this session */
  user_id: ObjectId
  /** Unique identifier for the device */
  device_id: string

  /** Optional browser/device information string */
  device_info?: string
  /** Optional user-friendly name for the device */
  device_name?: string
  /** Optional platform identifier (iOS, Android, Web, Desktop) */
  platform?: string
  /** Optional full user agent string from the browser */
  user_agent?: string
  /** Optional browser name (Chrome, Safari, Firefox, etc.) */
  browser?: string
  /** Optional operating system (Windows, macOS, Linux, iOS, Android) */
  os?: string
  /** Optional IP address for the session */
  ip_address?: string

  /** Whether the session is currently active */
  is_active: boolean
  /** Timestamp of the last activity in this session */
  last_activity: Date

  /** Array of login histories with timestamps and IP addresses */
  login_history: ILoginHistory[]
}
