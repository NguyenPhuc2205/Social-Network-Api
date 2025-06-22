/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/comment-report.interface.ts
 * @Description   : Comment report interface - extends the main Report interface for comment-specific reports
 */

import { ObjectId } from 'mongodb'
import { IReport } from '~/infrastructure/database/interfaces/report.interface'

/**
 * Comment report interface - a specialized view of IReport for comment reports
 * This interface represents reports specifically targeting comments
 * 
 * @interface ICommentReport
 * @extends Omit<IReport, 'reported_user_id' | 'reported_post_id' | 'reported_message_id' | 'reported_group_id'>
 * @property {ObjectId} reported_comment_id - ID of the comment being reported (required for comment reports)
 * @property {ObjectId} reported_user_id - Optional ID of the user who owns the reported comment
 */
export interface ICommentReport extends Omit<IReport, 'reported_user_id' | 'reported_post_id' | 'reported_message_id' | 'reported_group_id'> {
  /** ID of the comment being reported (required for comment reports) */
  reported_comment_id: ObjectId
  /** Optional ID of the user who owns the reported comment */
  reported_user_id?: ObjectId | null
}