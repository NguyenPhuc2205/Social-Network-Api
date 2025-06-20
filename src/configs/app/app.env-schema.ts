/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-27 23:23:26
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-30 10:39:50
 * @FilePath      : /server/src/configs/app/app.env-schema.ts
 * @Description   : Schema for validating app environment variables
 */

import { z } from 'zod'

export const appEnvSchema = z.object({
  // Server configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().optional().default('/v1/api'),

  // Application metadata
  APP_NAME: z.string().optional().default('Social Network App'),
  APP_VERSION: z.string().optional().default('1.0.0'),

  // Security and Networking
  CORS_ORIGINS: z.preprocess(
    (val) => typeof val === 'string' ? val.split(',') : val,
    z.array(z.string()).optional().default(['*'])
  ),
  TRUST_PROXY: z.coerce.boolean().default(false),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(1000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  
  // URLs & Domain
  DOMAIN: z.string().default('localhost'),
  CLIENT_URL: z.string().optional().default('http://localhost:3000'),
  SERVER_URL: z.string().optional().default('http://localhost:4000'),
} as const)

export type AppEnvSchema = z.infer<typeof appEnvSchema>
