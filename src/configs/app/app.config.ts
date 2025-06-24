/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-27 23:23:26
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-30 23:17:17
 * @FilePath      : /server/src/configs/app/app.config.ts
 * @Description   : App Configuration for whole application
 */

import { inject, injectable } from 'inversify'
import { DI_TYPES } from '~/core/providers'
import { IConfigService } from '~/configs/config.interface'

/**
 * Application configuration interface
 */
export interface IAppConfig {
  // Server configuration
  NODE_ENV: string
  PORT: number
  API_PREFIX: string

  // Application metadata
  APP_NAME: string
  APP_VERSION: string

  // Security and Networking
  CORS_ORIGINS: string[]
  TRUST_PROXY: boolean
  RATE_LIMIT_WINDOW_MS: number
  RATE_LIMIT_MAX: number

  // URLs & Domain
  DOMAIN: string
  CLIENT_URL: string
  SERVER_URL: string

  // ENV Flags
  IS_DEVELOPMENT: boolean
  IS_PRODUCTION: boolean
  IS_TEST: boolean
}

@injectable()
export class AppConfig implements IAppConfig {
  private _config: IAppConfig | null = null

  constructor(
    @inject(DI_TYPES.IConfigService)
    private configService: IConfigService
  ) {}

  private loadConfig(): IAppConfig {
    // No config loaded yet, load it from the config service
    if (!this._config) {
      // Get the configuration from the config service (Contains validated environment variables)
      const validatedConfig = this.configService.getConfig()

      this._config = {
        NODE_ENV: validatedConfig.NODE_ENV,
        PORT: validatedConfig.PORT,
        API_PREFIX: validatedConfig.API_PREFIX,

        APP_NAME: validatedConfig.APP_NAME,
        APP_VERSION: validatedConfig.APP_VERSION,
        
        CORS_ORIGINS: validatedConfig.CORS_ORIGINS,
        TRUST_PROXY: validatedConfig.TRUST_PROXY,
        RATE_LIMIT_WINDOW_MS: validatedConfig.RATE_LIMIT_WINDOW_MS,
        RATE_LIMIT_MAX: validatedConfig.RATE_LIMIT_MAX,

        DOMAIN: validatedConfig.DOMAIN,
        CLIENT_URL: validatedConfig.CLIENT_URL,
        SERVER_URL: validatedConfig.SERVER_URL,

        IS_DEVELOPMENT: validatedConfig.NODE_ENV === 'development',
        IS_PRODUCTION: validatedConfig.NODE_ENV === 'production',
        IS_TEST: validatedConfig.NODE_ENV === 'test'
      }
    }
  
    return this._config
  }

  /** Gets the current Node.js environment */
  get NODE_ENV(): string {
    return this.loadConfig().NODE_ENV
  }

  /** Gets the server port number */
  get PORT(): number {
    return this.loadConfig().PORT
  }

  /** Gets the API prefix for all routes */
  get API_PREFIX(): string {
    return this.loadConfig().API_PREFIX
  }

  /** Gets the application name */
  get APP_NAME(): string {
    return this.loadConfig().APP_NAME
  }

  /** Gets the application version */
  get APP_VERSION(): string {
    return this.loadConfig().APP_VERSION
  }

  /** Gets the allowed CORS origins */
  get CORS_ORIGINS(): string[] {
    return this.loadConfig().CORS_ORIGINS
  }

  /** Gets whether to trust proxy headers */
  get TRUST_PROXY(): boolean {
    return this.loadConfig().TRUST_PROXY
  }

  /** Gets the rate limit window in milliseconds */
  get RATE_LIMIT_WINDOW_MS(): number {
    return this.loadConfig().RATE_LIMIT_WINDOW_MS
  }

  /** Gets the maximum number of requests in rate limit window */
  get RATE_LIMIT_MAX(): number {
    return this.loadConfig().RATE_LIMIT_MAX
  }

  /** Gets the domain name */
  get DOMAIN(): string {
    return this.loadConfig().DOMAIN
  }

  /** Gets the client application URL */
  get CLIENT_URL(): string {
    return this.loadConfig().CLIENT_URL
  }

  /** Gets the server application URL */
  get SERVER_URL(): string {
    return this.loadConfig().SERVER_URL
  }

  /** Checks if the environment is development */
  get IS_DEVELOPMENT(): boolean {
    return this.loadConfig().IS_DEVELOPMENT
  }

  /** Checks if the environment is production */
  get IS_PRODUCTION(): boolean {
    return this.loadConfig().IS_PRODUCTION
  }

  /** Checks if the environment is test */
  get IS_TEST(): boolean {
    return this.loadConfig().IS_TEST
  }
}

