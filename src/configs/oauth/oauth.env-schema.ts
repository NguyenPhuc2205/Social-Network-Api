/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-31 23:23:26
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-31 00:10:54
 * @FilePath      : /server/src/configs/oauth/oauth.env-schema.ts
 * @Description   : Schema for validating OAuth environment variables
 */

import { z } from 'zod'

/**
 * Schema for validating OAuth environment variables
 */
export const oAuthEnvSchema = z.object({
  // Google OAuth2 configuration
  GOOGLE_OAUTH2_SERVER_ADDRESS: z.string().email().optional(),
  GOOGLE_OAUTH2_CLIENT_ID: z.string().trim(),
  GOOGLE_OAUTH2_PROJECT_ID: z.string().trim().optional(),
  GOOGLE_OAUTH2_CLIENT_SECRET: z.string().trim(),
  GOOGLE_OAUTH2_REDIRECT_URIS: z.string().trim(),
  GOOGLE_OAUTH2_AUTH_URI: z.string().url().default('https://accounts.google.com/o/oauth2/auth'),
  GOOGLE_OAUTH2_TOKEN_URI: z.string().url().default('https://oauth2.googleapis.com/token'),
  GOOGLE_OAUTH2_AUTH_PROVIDER_CERT_URL: z.string().url().default('https://www.googleapis.com/oauth2/v1/certs'),
  GOOGLE_OAUTH2_REFRESH_TOKEN: z.string().trim().optional(),
} as const)

/**
 * Type for OAuth environment variables
 */
export type OAuthEnvSchema = z.infer<typeof oAuthEnvSchema>
