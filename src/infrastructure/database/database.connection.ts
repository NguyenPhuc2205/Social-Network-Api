/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-02 10:24:50
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-02 13:08:10
 * @FilePath      : /server/src/infrastructure/database/mongodb/database.connection.ts
 * @Description   : Database Connection for MongoDB
 */

import { inject, injectable } from 'inversify'
import { Db, MongoClient } from 'mongodb'
import { getCallerLocation } from '~/common/helpers'
import { IDatabaseConfig } from '~/configs'
import { DI_TYPES } from '~/core/providers'
import { IDatabaseConnection } from '~/infrastructure/database/database.interface'
import { IWinstonLoggerService } from '~/infrastructure/loggers'

@injectable()
export class DatabaseConnection implements IDatabaseConnection {
  private static instance: IDatabaseConnection | null

  private static isInitialized = false

  private static initializationPromise: Promise<IDatabaseConnection> | null = null

  private client: MongoClient

  private db: Db | null = null

  private connectionString: string = ''

  constructor(
    @inject(DI_TYPES.IDatabaseConfig)
    private databaseConfig: IDatabaseConfig,

    @inject(DI_TYPES.IWinstonLoggerService)
    private loggerService: IWinstonLoggerService
  ) {
    this.connectionString = this.databaseConfig.getMongoDBConnectionString()
    
    // Initialize MongoClient with a maximum pool size (Not connect yet)
    this.client = new MongoClient(this.connectionString, {
      maxPoolSize: 30
    })
  }

  public static getInstance(): IDatabaseConnection {
    if (!DatabaseConnection.instance || !DatabaseConnection.isInitialized) {
      throw new Error(
        'DatabaseConnection is not initialized. Call initialize() first.'
      )
    }

    return DatabaseConnection.instance
  }

  public async initialize(): Promise<IDatabaseConnection> {
    if (DatabaseConnection.isInitialized && DatabaseConnection.instance) {
      return DatabaseConnection.instance
    }

    if (DatabaseConnection.initializationPromise) {
      this.loggerService.info({
        message: 'DatabaseConnection is already being initialized. Waiting for completion...',
        context: {
          module: 'DatabaseConnection',
          method: 'initialize',
          route: getCallerLocation(),
          action: 'WAIT_FOR_INITIALIZATION',
        },
        requestId: '-',
      })
      return DatabaseConnection.initializationPromise
    }

    DatabaseConnection.initializationPromise = this.performInitialization()

    try {
      const result = await DatabaseConnection.initializationPromise
      return result
    } catch (error) {
      DatabaseConnection.initializationPromise = null
      throw error
    }
  }

  private async performInitialization(): Promise<DatabaseConnection> {
    const maxRetries = 3
    let attempt = 0

    while (attempt < maxRetries) {
      try {
        this.loggerService.info({
          message: `Starting DatabaseConnection initialization (Attempt ${attempt + 1})...`,
          context: {
            module: 'DatabaseConnection',
            method: 'performInitialization',
            route: getCallerLocation(),
            action: 'START_INITIALIZATION',
          },
          requestId: '-',
        })

        await this.client.connect()
        this.db = this.client.db(this.databaseConfig.MONGODB_NAME)

        DatabaseConnection.isInitialized = true
        DatabaseConnection.instance = this

        this.loggerService.info({
          message: 'DatabaseConnection initialized successfully',
          context: {
            module: 'DatabaseConnection',
            method: 'performInitialization',
            route: getCallerLocation(),
            action: 'INITIALIZATION_SUCCESS',
          },
          requestId: '-',
          metadata: { database: this.databaseConfig.MONGODB_NAME },
        })

        return this
      } catch (error) {
        attempt++
        this.loggerService.warn({
          message: `Database connection attempt ${attempt} failed`,
          context: {
            module: 'DatabaseConnection',
            method: 'performInitialization',
            route: getCallerLocation(),
            action: 'CONNECTION_RETRY',
          },
          requestId: '-',
          error: error as Error,
        })

        if (attempt === maxRetries) {
          this.loggerService.error({
            message: 'Failed to initialize DatabaseConnection after maximum retries',
            context: {
              module: 'DatabaseConnection',
              method: 'performInitialization',
              route: getCallerLocation(),
              action: 'INITIALIZATION_ERROR',
            },
            requestId: '-',
            error: error as Error,
          })

          if (process.env.NODE_ENV === 'production') {
            throw new Error('Failed to initialize DatabaseConnection. Application cannot continue.')
          }
          throw error
        }

        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }

    throw new Error('Unexpected error in DatabaseConnection initialization')
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.')
    }
    return this.db
  }

  public async closeMongoDB(): Promise<void> {
    try {
      await this.client.close()
      this.loggerService.info({
        message: 'Database connection closed successfully',
        context: {
          module: 'DatabaseConnection',
          method: 'close',
          route: getCallerLocation(),
          action: 'CONNECTION_CLOSED',
        },
        requestId: '-',
      })
      DatabaseConnection.instance = null
      DatabaseConnection.isInitialized = false
      this.db = null
    } catch (error) {
      this.loggerService.error({
        message: 'Failed to close database connection',
        context: {
          module: 'DatabaseConnection',
          method: 'close',
          route: getCallerLocation(),
          action: 'CONNECTION_CLOSE_ERROR',
        },
        requestId: '-',
        error: error as Error,
      })
      throw error
    }
  }

  public resetMongoDB(): void {
    this.loggerService.info({
      message: 'Resetting DatabaseConnection',
      context: {
        module: 'DatabaseConnection',
        method: 'reset',
        route: getCallerLocation(),
        action: 'RESET_CONNECTION',
      },
      requestId: '-',
    })

    DatabaseConnection.instance = null
    DatabaseConnection.isInitialized = false
    DatabaseConnection.initializationPromise = null
    this.db = null
  }

  public getConnectionString(): string {
    return this.connectionString
  }
}
