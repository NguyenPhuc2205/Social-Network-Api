/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-04 00:25:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 00:25:00
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
