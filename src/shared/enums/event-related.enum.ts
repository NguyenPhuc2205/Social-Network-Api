/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-04 00:25:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 00:25:00
 * @FilePath      : /server/src/shared/enums/event-related.enum.ts
 * @Description   : Enumerations related to event management and attendance
 */

/**
 * Enumeration of possible attendance statuses for event invitees
 * Used to track user responses to event invitations
 * 
 * @enum {string}
 */
export enum EventAttendeeStatus {
  /** User has confirmed attendance to the event */
  Going = 'Going',
  
  /** User has expressed interest but not committed to attending */
  Interested = 'Interested',
  
  /** User has declined to attend the event */
  NotGoing = 'NotGoing'
}
