/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-09 11:44:57
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-09 20:59:21
 * @FilePath      : /server/src/shared/interfaces/interaction-related.interface.ts
 * @Description   : Interaction-related interfaces for MongoDB Native Driver
 */

import { ObjectId } from 'mongodb'

export interface IConversationNickname {
  user_id: ObjectId
  nickname: string
}

export interface IMessageReadBy {
  user_id: ObjectId
  read_at: Date
}
