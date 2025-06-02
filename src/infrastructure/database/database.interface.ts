/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-02 10:25:45
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-02 12:43:47
 * @FilePath      : /server/src/infrastructure/database/mongodb/database.interface.ts
 * @Description   : Interface for MongoDB Database Connection and Services
 */

import { Collection, Db } from 'mongodb'

export interface IDatabaseConnection {
  initialize(): Promise<IDatabaseConnection>

  getDb(): Db

  closeMongoDB(): Promise<void>

  resetMongoDB(): void

  getConnectionString(): string
}

export interface IDatabaseService {
  users: Collection

  refreshTokens: Collection
  
  followers: Collection
}
