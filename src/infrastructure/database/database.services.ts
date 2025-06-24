/*
 * @Author       : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date         : 2025-03-18 00:30:04
 * @LastEditors  : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime : 2025-06-02 12:38:36
 * @FilePath     : /server/src/infrastructure/databases/mongodb/database.service.ts
 * @Description  : MongoDB Database Service for Collection Access
 */

import { Collection } from 'mongodb';
import { inject, injectable } from 'inversify';
import { DI_TYPES } from '~/core/providers';
import { IDatabaseConfig } from '~/configs';
import { IDatabaseConnection, IDatabaseService } from './database.interface';

@injectable()
export class DatabaseService implements IDatabaseService {
  constructor(
    @inject(DI_TYPES.IDatabaseConfig)
    private databaseConfig: IDatabaseConfig,
    
    @inject(DI_TYPES.IDatabaseConnection)
    private databaseConnection: IDatabaseConnection
  ) {}

  public get users(): Collection {
    return this.databaseConnection.getDb().collection(this.databaseConfig.MONGODB_USERS_COLLECTION);
  }

  public get refreshTokens(): Collection {
    return this.databaseConnection.getDb().collection(this.databaseConfig.MONGODB_REFRESH_TOKENS_COLLECTION);
  }

  public get followers(): Collection {
    return this.databaseConnection.getDb().collection(this.databaseConfig.MONGODB_FOLLOWERS_COLLECTION);
  }
}
