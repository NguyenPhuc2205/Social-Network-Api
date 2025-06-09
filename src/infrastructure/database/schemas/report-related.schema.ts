/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-09 17:59:39
 * @FilePath      : /server/src/infrastructure/database/schemas/report-related.schema.ts
 * @Description   : Moderation and reporting schemas for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'
import { BaseSchema } from '~/core/bases/base.schemas'
import { 
  ReportReason,
  ReportStatus
} from '~/shared/enums'

/**
 * Report schema for managing content moderation and user reports
 * 
 * @interface IReportSchema
 * @extends BaseSchema
 * @property {ObjectId} reporter_id - ID of the user who submitted the report
 * @property {ObjectId} reported_user_id - Optional ID of the user being reported
 * @property {ObjectId} reported_post_id - Optional ID of the post being reported
 * @property {ObjectId} reported_message_id - Optional ID of the message being reported
 * @property {ObjectId} reported_group_id - Optional ID of the group being reported
 * @property {ReportReason} reason - Reason for the report (Spam, Abusive, Harmful, etc.)
 * @property {string} description - Optional additional details provided by the reporter
 * @property {string[]} evidence_urls - Optional array of URLs to evidence supporting the report
 * @property {ReportStatus} status - Current status of the report (Pending, InReview, Resolved, Rejected)
 * @property {string} admin_notes - Optional notes added by moderators or administrators
 * @property {ObjectId} reviewer_id - Optional ID of the admin/moderator who reviewed the report
 * @property {Date} reviewed_at - Optional timestamp when the report was reviewed
 * @property {string} resolution - Optional outcome or resolution of the report review
 * @property {string} action_taken - Optional description of actions taken (e.g., 'banned user', 'removed post')
 * @property {number} priority - Priority level for report handling (1 for urgent, 5 for low)
 * @property {string} category - Optional category classification for the report
 */
export interface IReportSchema extends BaseSchema {
  /** ID of the user who submitted the report */
  reporter_id: ObjectId
  /** Optional ID of the user being reported */
  reported_user_id?: ObjectId
  /** Optional ID of the post being reported */
  reported_post_id?: ObjectId
  /** Optional ID of the message being reported */
  reported_message_id?: ObjectId
  /** Optional ID of the group being reported */
  reported_group_id?: ObjectId
  
  /** Reason for the report (Spam, Abusive, Harmful, etc.) */
  reason: ReportReason
  /** Optional additional details provided by the reporter */
  description?: string
  /** Optional array of URLs to evidence supporting the report */
  evidence_urls?: string[]
  
  /** Current status of the report (Pending, InReview, Resolved, Rejected) */
  status: ReportStatus
  /** Optional notes added by moderators or administrators */
  admin_notes?: string
  /** Optional ID of the admin/moderator who reviewed the report */
  reviewer_id?: ObjectId
  /** Optional timestamp when the report was reviewed */
  reviewed_at?: Date
  /** Optional outcome or resolution of the report review */
  resolution?: string
  /** Optional description of actions taken (e.g., 'banned user', 'removed post') */
  action_taken?: string
  /** Priority level for report handling (1 for urgent, 5 for low) */
  priority: number
  /** Optional category classification for the report */
  category?: string
}
