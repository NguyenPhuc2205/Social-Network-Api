/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-21 00:09:20
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 00:10:19
 * @FilePath      : /server/src/shared/constants/media-limits.constant.ts
 * @Description   : Constants for media file size limits and maximum items
 */

export const MEDIA_LIMITS = {
  IMAGE_SIZE_LIMIT: 50 * 1024 * 1024, // 50MB
  VIDEO_SIZE_LIMIT: 1024 * 1024 * 1024, // 1GB
  AUDIO_SIZE_LIMIT: 50 * 1024 * 1024, // 50MB
  DOCUMENT_SIZE_LIMIT: 500 * 1024 * 1024, // 500MB
  MAX_MEDIA_ITEMS: 10,
}
