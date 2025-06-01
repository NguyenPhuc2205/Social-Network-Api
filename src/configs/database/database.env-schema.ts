/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-27 23:23:26
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-31 00:33:30
 * @FilePath      : /server/src/configs/database/database.env-schema.ts
 * @Description   : Schema for validating database environment variables
 */
import z from 'zod'

/**
 * Schema for validating database environment variables
 */
export const databaseEnvSchema = z.object({
  // MongoDB configuration
  MONGODB_NAME: z.string().trim().default('twitter'),
  MONGODB_USERNAME: z.string().trim().optional(),
  MONGODB_PASSWORD: z.string().trim().optional(),
  MONGODB_HOST: z.string().trim().default('localhost'),
  MONGODB_URI_OPTIONS: z.string().trim().optional(),
  MONGODB_URI: z.string().trim().optional(),

  MONGODB_USERS_COLLECTION: z.string().trim().default('users'),
  MONGODB_REFRESH_TOKENS_COLLECTION: z.string().trim().default('refresh_tokens'),
  MONGODB_FOLLOWERS_COLLECTION: z.string().trim().default('followers'),

  // Redis configuration
  REDIS_HOST: z.string().trim().default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_DB: z.number().int().nonnegative().default(0),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_USERNAME: z.string().optional(),
  REDIS_TLS: z.boolean().default(false),
  REDIS_URI: z.string().optional(),
} as const)

/**
 * Type for the database environment variables
 */
export type DatabaseEnvSchema = z.infer<typeof databaseEnvSchema>
