/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-20 23:33:40
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 01:56:16
 * @FilePath      : /server/src/shared/schemas/primitives/device.schema.ts
 * @Description   : Device-related schema validations
 */

import { z } from 'zod'
import { DateSchema } from '~/shared/schemas/primitives/dates.schema'

// ===========================
// DEVICE IDENTIFIERS
// ===========================
export const DeviceIdSchema = z.string().min(1).max(100)

export const SessionIdSchema = z.string().min(1)

// ===========================
// DEVICE INFORMATION
// ===========================
export const DeviceNameSchema = z.string().trim().max(100)

export const PlatformSchema = z.string().trim().max(50)

export const BrowserSchema = z.string().trim().max(50)

export const OSSchema = z.string().trim().max(50)

export const UserAgentSchema = z.string().trim().max(500)

export const IPAddressSchema = z.string()
  .refine((val) => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/
    return ipv4Regex.test(val) || ipv6Regex.test(val)
  })

// ===========================
// DEVICE METADATA
// ===========================
export const DeviceInfoSchema = z.object({
  device_name: DeviceNameSchema,
  platform: PlatformSchema,
  browser: BrowserSchema,
  os: OSSchema,
  user_agent: UserAgentSchema,
  ip_address: IPAddressSchema,
})

// ===========================
// LOGIN HISTORY
// ===========================
export const LoginHistorySchema = z.array(
  z.object({
    timestamp: DateSchema,
    ip_address: IPAddressSchema,
    location: z.string().trim().max(200),
    success: z.boolean(),
  })
)

// ===========================
// TYPE EXPORTS
// ===========================
export type DeviceIdType = z.infer<typeof DeviceIdSchema>
export type DeviceInfoType = z.infer<typeof DeviceInfoSchema>
export type LoginHistoryType = z.infer<typeof LoginHistorySchema>
