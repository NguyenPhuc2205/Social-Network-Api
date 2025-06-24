/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 23:46:39
 * @FilePath      : /server/src/shared/interfaces/content-related.interface.ts
 * @Description   : Interfaces related to content dimensions, reactions, and poll options
 */

/**
 * Defines the dimensions of media content
 * 
 * @interface IMediaDimensions
 * @property {number} width - Width of the media in pixels
 * @property {number} height - Height of the media in pixels
 */
export interface IMediaDimensions {
  width: number
  height: number
}

/**
 * Defines the count of different reaction types for content
 * 
 * @interface IReactionCounts
 * @property {number} Like
 * @property {number} Love
 * @property {number} Haha
 * @property {number} Wow
 * @property {number} Sad
 * @property {number} Angry
 */
export interface IReactionCounts {
  Like: number // Count of Like reactions
  Love: number 
  Haha: number 
  Wow: number 
  Sad: number 
  Angry: number 
}

/**
 * Defines an option in a poll with its text and vote count
 * 
 * @interface IPollOption
 * @property {string} text - Text of the poll option
 * @property {number} vote_count - Number of votes for this option
 */
export interface IPollOption {
  text: string
  vote_count: number
}
