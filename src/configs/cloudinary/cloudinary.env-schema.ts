/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-30 15:15:48
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-31 00:32:07
 * @FilePath      : /server/src/configs/cloudinary/cloudinary.env-schema.ts
 * @Description   : Cloudinary environment variable schema definition
 */
import { z } from 'zod'

export const cloudinaryEnvSchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string().trim(),
  CLOUDINARY_API_KEY: z.string().trim(),
  CLOUDINARY_API_SECRET: z.string().trim(),
  CLOUDINARY_UPLOAD_PRESET: z.string().trim().optional(),
  CLOUDINARY_ASSET_FOLDER: z.string().trim().optional(),
} as const)

export type CloudinaryEnvSchema = z.infer<typeof cloudinaryEnvSchema>
