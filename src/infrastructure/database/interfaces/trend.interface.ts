/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/trend.interface.ts
 * @Description   : Trend interface for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schema'
import { IGeoJsonPoint } from '~/shared/interfaces'

/**
 * Trend interface for tracking trending topics and hashtags
 * 
 * @interface ITrend
 * @extends BaseSchema
 * @property {string} name - Name of the trending topic
 * @property {ObjectId} hashtag_id - Optional reference to hashtag if trend is hashtag-based
 * @property {number} post_count - Total number of posts related to this trend
 * @property {number} trend_score - Calculated score based on velocity, volume, and engagement
 * @property {IGeoJsonPoint} location - Optional geographic location for location-specific trends
 */
export interface ITrend extends BaseSchema {
  /** Name of the trending topic */
  name: string
  /** Optional reference to hashtag if trend is hashtag-based */
  hashtag_id?: ObjectId
  /** Total number of posts related to this trend */
  post_count: number
  /** Calculated score based on velocity, volume, and engagement */
  trend_score: number
  /** Optional geographic location for location-specific trends */
  location?: IGeoJsonPoint
}
