/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-27 23:23:26
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-30 14:45:52
 * @FilePath      : /server/src/configs/auth/auth.env-schema.ts
 * @Description   : Schema for validating auth environment variables
 */

import { z } from 'zod'

/**
 * Schema for validating the auth environment variables
 */
export const authEnvSchema = z.object({
  // JWT configuration keys
  JWT_SECRET: z.string().trim().min(5),

  // JWT access token
  JWT_ACCESS_TOKEN_SECRET: z.string().trim().min(5),
  ACCESS_TOKEN_EXPIRES_IN: z.string().trim().default('15m'),

  // JWT refresh token
  JWT_REFRESH_TOKEN_SECRET: z.string().trim().min(5),
  REFRESH_TOKEN_EXPIRES_IN: z.string().trim().default('30d'),
  
  // JWT email verification and forgot password tokens
  JWT_EMAIL_VERIFY_TOKEN_SECRET: z.string().trim().min(5),
  EMAIL_VERIFY_TOKEN_EXPIRES_IN: z.string().trim().default('7d'),

  // JWT forgot password token
  JWT_FORGOT_PASSWORD_TOKEN_SECRET: z.string().trim().min(5),
  FORGOT_PASSWORD_TOKEN_EXPIRES_IN: z.string().trim().default('1d'),

  JWT_ALGORITHM: z.string().trim().default('HS256'),
} as const)

/**
 * Type for the auth environment variables
 */
export type AuthEnvSchema = z.infer<typeof authEnvSchema>
