/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-02 12:06:49
 * @FilePath      : /server/src/configs/database/database.config.ts
 * @Description   : Database configuration interface and implementation
 */

import { inject, injectable } from 'inversify'
import { DI_TYPES } from '~/core/providers'
import { IConfigService } from '~/configs/config.interface'

export interface IDatabaseConfig {
  MONGODB_NAME: string
  MONGODB_USERNAME?: string
  MONGODB_PASSWORD?: string
  MONGODB_HOST: string
  MONGODB_URI_OPTIONS?: string
  MONGODB_URI?: string
  MONGODB_USERS_COLLECTION: string
  MONGODB_REFRESH_TOKENS_COLLECTION: string
  MONGODB_FOLLOWERS_COLLECTION: string
  REDIS_HOST: string
  REDIS_PORT: number
  REDIS_DB: number
  REDIS_PASSWORD?: string
  REDIS_USERNAME?: string
  REDIS_TLS: boolean
  REDIS_URI?: string
  getMongoDBConnectionString(): string
  getRedisConnectionString(): string
}

@injectable()
export class DatabaseConfig implements IDatabaseConfig {
  private _config: IDatabaseConfig | null = null

  constructor(
    @inject(DI_TYPES.IConfigService)
    private configService: IConfigService
  ) {}

  private loadConfig(): IDatabaseConfig {
    if (!this._config) {
      const config = this.configService.getConfig()

      this._config = {
        MONGODB_NAME: config.MONGODB_NAME,
        MONGODB_USERNAME: config.MONGODB_USERNAME,
        MONGODB_PASSWORD: config.MONGODB_PASSWORD,
        MONGODB_HOST: config.MONGODB_HOST,
        MONGODB_URI_OPTIONS: config.MONGODB_URI_OPTIONS,
        MONGODB_URI: config.MONGODB_URI,
        MONGODB_USERS_COLLECTION: config.MONGODB_USERS_COLLECTION,
        MONGODB_REFRESH_TOKENS_COLLECTION: config.MONGODB_REFRESH_TOKENS_COLLECTION,
        MONGODB_FOLLOWERS_COLLECTION: config.MONGODB_FOLLOWERS_COLLECTION,

        REDIS_HOST: config.REDIS_HOST,
        REDIS_PORT: config.REDIS_PORT,
        REDIS_DB: config.REDIS_DB,
        REDIS_PASSWORD: config.REDIS_PASSWORD,
        REDIS_USERNAME: config.REDIS_USERNAME,
        REDIS_TLS: config.REDIS_TLS,
        REDIS_URI: config.REDIS_URI,
        
        getMongoDBConnectionString: this.getMongoDBConnectionString.bind(this),
        getRedisConnectionString: this.getRedisConnectionString.bind(this)
      }
    }

    return this._config
  }

  /** Gets the MongoDB database name */
  get MONGODB_NAME(): string {
    return this.loadConfig().MONGODB_NAME
  }

  /** Gets the MongoDB username for authentication */
  get MONGODB_USERNAME(): string | undefined {
    return this.loadConfig().MONGODB_USERNAME
  }

  /** Gets the MongoDB password for authentication */
  get MONGODB_PASSWORD(): string | undefined {
    return this.loadConfig().MONGODB_PASSWORD
  }

  /** Gets the MongoDB host address */
  get MONGODB_HOST(): string {
    return this.loadConfig().MONGODB_HOST
  }

  /** Gets the MongoDB URI connection options */
  get MONGODB_URI_OPTIONS(): string | undefined {
    return this.loadConfig().MONGODB_URI_OPTIONS
  }

  /** Gets the complete MongoDB connection URI if specified */
  get MONGODB_URI(): string | undefined {
    return this.loadConfig().MONGODB_URI
  }

  /** Gets the MongoDB users collection name */
  get MONGODB_USERS_COLLECTION(): string {
    return this.loadConfig().MONGODB_USERS_COLLECTION
  }

  /** Gets the MongoDB refresh tokens collection name */
  get MONGODB_REFRESH_TOKENS_COLLECTION(): string {
    return this.loadConfig().MONGODB_REFRESH_TOKENS_COLLECTION
  }

  /** Gets the MongoDB followers collection name */
  get MONGODB_FOLLOWERS_COLLECTION(): string {
    return this.loadConfig().MONGODB_FOLLOWERS_COLLECTION
  }

  /** Gets the Redis host address */
  get REDIS_HOST(): string {
    return this.loadConfig().REDIS_HOST
  }

  /** Gets the Redis port number */
  get REDIS_PORT(): number {
    return this.loadConfig().REDIS_PORT
  }

  /** Gets the Redis database number */
  get REDIS_DB(): number {
    return this.loadConfig().REDIS_DB
  }

  /** Gets the Redis password for authentication */
  get REDIS_PASSWORD(): string | undefined {
    return this.loadConfig().REDIS_PASSWORD
  }

  /** Gets the Redis username for authentication */
  get REDIS_USERNAME(): string | undefined {
    return this.loadConfig().REDIS_USERNAME
  }

  /** Gets whether to use TLS for Redis connections */
  get REDIS_TLS(): boolean {
    return this.loadConfig().REDIS_TLS
  }

  /** Gets the complete Redis connection URI if specified */
  get REDIS_URI(): string | undefined {
    return this.loadConfig().REDIS_URI
  }

  /**
   * Builds a MongoDB connection string from individual config values
   * @returns MongoDB connection string
   */
  getMongoDBConnectionString(): string {
    const config = this.loadConfig()

    // If full URI is provided, use it (with password replacement if needed)
    if (config.MONGODB_URI) {
      return config.MONGODB_URI.replace('<db_password>', config.MONGODB_PASSWORD || '')
    }

    // Build connection string from individual parts
    const host = config.MONGODB_HOST || 'localhost:27017'
    const dbName = config.MONGODB_NAME || 'test'
    
    // Handle authentication
    const auth = config.MONGODB_USERNAME && config.MONGODB_PASSWORD
      ? `${config.MONGODB_USERNAME}:${config.MONGODB_PASSWORD}@`
      : ''

    // Handle options
    const options = config.MONGODB_URI_OPTIONS ? `?${config.MONGODB_URI_OPTIONS}` : ''

    // Determine protocol based on host (srv for Atlas, regular for localhost/custom)
    const protocol = host.includes('.mongodb.net') ? 'mongodb+srv' : 'mongodb'
    
    // Build final connection string
    return `${protocol}://${auth}${host}/${dbName}${options}`
  }

  /**
   * Builds a Redis connection string from individual config values
   * @returns Redis connection string
   */
  getRedisConnectionString(): string {
    const config = this.loadConfig()
    
    if (config.REDIS_URI) {
      return config.REDIS_URI
    }

    const auth = config.REDIS_USERNAME && config.REDIS_PASSWORD 
      ? `${config.REDIS_USERNAME}:${config.REDIS_PASSWORD}@` 
      : config.REDIS_PASSWORD 
        ? `:${config.REDIS_PASSWORD}@` 
        : ''

    const protocol = config.REDIS_TLS ? 'rediss' : 'redis'
    
    return `${protocol}://${auth}${config.REDIS_HOST}:${config.REDIS_PORT}/${config.REDIS_DB}`
  }
}
