/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-20 14:10:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 01:32:05
 * @FilePath      : /server/src/shared/schemas/primitives/media.schema.ts
 * @Description   : Media and file-related schema validations
 */

import { z } from 'zod'
import { MEDIA_LIMITS } from '~/shared/constants'
import { AudioMime, DocumentMime, ImageMime, VideoMime } from '~/shared/enums'

// ===========================
// URL VALIDATION
// ===========================
export const URLSchema = z.string()
  .url()
  .max(500)
  .refine((url) => {
    try {
      const parsedUrl = new URL(url)
      return ['http:', 'https:'].includes(parsedUrl.protocol)
    } catch {
      return false
    }
  })

export const OptionalURLSchema = URLSchema.optional()

export const NullableURLSchema = URLSchema.nullable()

export const OptionalNullableURLSchema = URLSchema.nullable().optional()

export const DefaultEmptyURLSchema = URLSchema.default('')

// ===========================
// SPECIFIC URL TYPES
// ===========================
export const ImageURLSchema = URLSchema

export const VideoURLSchema = URLSchema

export const AudioURLSchema = URLSchema

export const DocumentURLSchema = URLSchema

export const AvatarURLSchema = URLSchema

export const CoverPhotoURLSchema = URLSchema

export const WebsiteURLSchema = URLSchema

export const WebsiteArraySchema = z.array(WebsiteURLSchema).max(3)

export const ThumbnailURLSchema = URLSchema

export const InvoiceURLSchema = URLSchema

export const MeetingURLSchema = URLSchema

export const EvidenceURLsSchema = z.array(URLSchema).max(10)

// ===========================
// DIMENSIONS & MEASUREMENTS
// ===========================
export const FileSizeSchema = z.number().min(0)

export const WidthSchema = z.number().min(1).max(10000)

export const HeightSchema = z.number().min(1).max(10000)

export const VideoDurationSchema = z.number().min(0)

// ===========================
// MEDIA DIMENSIONS
// ===========================
export const MediaDimensionsSchema = z.object({
  width: WidthSchema,
  height: HeightSchema,
})

export const OptionalMediaDimensionsSchema = MediaDimensionsSchema.optional()

export const NullableMediaDimensionsSchema = MediaDimensionsSchema.nullable()

// ===========================
// MEDIA METADATA
// ===========================
export const MediaMetadataSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  originalName: z.string().trim().max(255),
  mimeType: z.string().trim().max(100),
  encoding: z.string().trim().max(50),
  size: FileSizeSchema,
  dimensions: OptionalMediaDimensionsSchema,
  duration: VideoDurationSchema.optional(),
  thumbnail: ThumbnailURLSchema.optional(),
  blurhash: z.string().max(100).optional(),
})

// ===========================
// MEDIA VALIDATION SCHEMAS
// ===========================
export const ImageFileSchema = z.object({
  url: ImageURLSchema,
  size: z.number().int().min(0).max(MEDIA_LIMITS.IMAGE_SIZE_LIMIT),
  mimeType: z.nativeEnum(ImageMime),
  dimensions: MediaDimensionsSchema,
})

export const VideoFileSchema = z.object({
  url: VideoURLSchema,
  size: z.number().int().min(0).max(MEDIA_LIMITS.VIDEO_SIZE_LIMIT),
  mimeType: z.nativeEnum(VideoMime),
  dimensions: MediaDimensionsSchema,
  duration: VideoDurationSchema.optional(),
  thumbnail: ThumbnailURLSchema,
})

export const AudioFileSchema = z.object({
  url: AudioURLSchema,
  size: z.number().int().min(0).max(MEDIA_LIMITS.AUDIO_SIZE_LIMIT),
  mimeType: z.nativeEnum(AudioMime),
  duration: VideoDurationSchema,
})

export const DocumentFileSchema = z.object({
  url: DocumentURLSchema,
  size: z.number().int().min(0).max(MEDIA_LIMITS.DOCUMENT_SIZE_LIMIT),
  mimeType: z.nativeEnum(DocumentMime),
})

// ===========================
// MEDIA ARRAY SCHEMAS
// ===========================
export const MediaArraySchema = z.array(z.union([
  ImageFileSchema,
  VideoFileSchema,
  AudioFileSchema,
  DocumentFileSchema
])).max(MEDIA_LIMITS.MAX_MEDIA_ITEMS).default([])

// ===========================
// TYPE EXPORTS
// ===========================
export type URLType = z.infer<typeof URLSchema>
export type MediaDimensionsType = z.infer<typeof MediaDimensionsSchema>
export type MediaMetadataType = z.infer<typeof MediaMetadataSchema>
export type ImageFileType = z.infer<typeof ImageFileSchema>
export type VideoFileType = z.infer<typeof VideoFileSchema>
export type AudioFileType = z.infer<typeof AudioFileSchema>
export type DocumentFileType = z.infer<typeof DocumentFileSchema>
