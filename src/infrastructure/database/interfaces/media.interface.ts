/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 21:13:47
 * @FilePath      : /server/src/infrastructure/database/interfaces/media.interface.ts
 * @Description   : Media interface for MongoDB Native Driver
 */

import { BaseSchema } from '~/core/bases/base.schema'
import { MediaType } from '~/shared/enums'
import { IMediaDimensions } from '~/shared/interfaces'

/**
 * Media interface for storing media files
 * 
 * @interface IMedia
 * @extends BaseSchema
 * @property {string} url - URL to the media file
 * @property {MediaType} type - Type of media (Image, Video, Gif, Audio, Document, Link)
 * @property {number} size - File size in bytes
 * @property {IMediaDimensions} media_dimensions - Optional dimensions for images/videos
 */
export interface IMedia extends BaseSchema {
  /** URL to the media file */
  url: string
  /** Type of media (Image, Video, Gif, Audio, Document, Link) */
  type: MediaType
  /** File size in bytes */
  size: number
  /** Optional dimensions for images/videos */
  media_dimensions?: IMediaDimensions
}
