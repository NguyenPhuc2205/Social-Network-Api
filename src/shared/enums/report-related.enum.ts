/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-04 00:25:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 22:15:09
 * @FilePath      : /server/src/shared/enums/report-related.enum.ts
 * @Description   : Enumerations related to content and user reporting
 */

/**
 * Enumeration of reasons for reporting content or users
 * Used when users submit reports for inappropriate content or behavior
 * 
 * @enum {string}
 */
export enum ReportReason {
  /** Content classified as unwanted repetitive content */
  Spam = 'Spam',
  
  /** Content that contains offensive language or harassment */
  Abusive = 'Abusive',
  
  /** Content that may cause harm to individuals or groups */
  Harmful = 'Harmful',
  
  /** Content containing false or misleading information */
  Misinformation = 'Misinformation',
  
  /** Reports that don't fit into the predefined categories */
  Other = 'Other'
}

/**
 * Enumeration of statuses for content/user reports
 * Used in Report table to track the status of a report
 * 
 * @enum {string}
 */
export enum ReportStatus {
  /** Awaiting review */
  Pending = 'pending',

  /** Report has been reviewed by moderators */
  Reviewed = 'reviewed',

  /** Report has been resolved, action taken if necessary */
  Resolved = 'resolved',

  /** Report has been rejected, no action executed */
  Rejected = 'rejected'
}
