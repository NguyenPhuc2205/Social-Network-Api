/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-27 23:23:26
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-30 23:20:34
 * @FilePath      : /server/src/configs/auth/auth.config.ts
 * @Description   : Configuration for authentication settings
 */

import { inject, injectable } from 'inversify'
import { DI_TYPES } from '~/core/providers'
import { IConfigService } from '~/configs/config.interface'

export interface IAuthConfig {
  // JWT configuration
  JWT_SECRET: string

  // JWT access token
  JWT_ACCESS_TOKEN_SECRET: string
  JWT_ACCESS_TOKEN_EXPIRES_IN: string

  // JWT refresh token
  JWT_REFRESH_TOKEN_SECRET: string
  JWT_REFRESH_TOKEN_EXPIRES_IN: string
  
  // JWT email verification
  JWT_EMAIL_VERIFY_TOKEN_SECRET: string
  JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN: string

  // JWT forgot password token
  JWT_FORGOT_PASSWORD_TOKEN_SECRET: string
  JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN: string
  
  JWT_ALGORITHM: string
}

@injectable()
export class AuthConfig implements IAuthConfig {
  private _config: IAuthConfig | null = null

  constructor(
    @inject(DI_TYPES.IConfigService)
    private configService: IConfigService
  ) {}

  private loadConfig(): IAuthConfig {
    if (!this._config) {
      const validatedConfigs = this.configService.getConfig()

      this._config = {
        // JWT configuration
        JWT_SECRET: validatedConfigs.JWT_SECRET,

        // JWT access token
        JWT_ACCESS_TOKEN_SECRET: validatedConfigs.JWT_ACCESS_TOKEN_SECRET,
        JWT_ACCESS_TOKEN_EXPIRES_IN: validatedConfigs.ACCESS_TOKEN_EXPIRES_IN,
        
        // JWT refresh token
        JWT_REFRESH_TOKEN_SECRET: validatedConfigs.JWT_REFRESH_TOKEN_SECRET,
        JWT_REFRESH_TOKEN_EXPIRES_IN: validatedConfigs.REFRESH_TOKEN_EXPIRES_IN,
        
        // JWT email verification
        JWT_EMAIL_VERIFY_TOKEN_SECRET: validatedConfigs.JWT_EMAIL_VERIFY_TOKEN_SECRET,
        JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN: validatedConfigs.EMAIL_VERIFY_TOKEN_EXPIRES_IN,
        
        // JWT forgot password token
        JWT_FORGOT_PASSWORD_TOKEN_SECRET: validatedConfigs.JWT_FORGOT_PASSWORD_TOKEN_SECRET,
        JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN: validatedConfigs.FORGOT_PASSWORD_TOKEN_EXPIRES_IN,
        
        JWT_ALGORITHM: validatedConfigs.JWT_ALGORITHM
      }
    }

    return this._config
  }

  /** Gets the main JWT secret key */
  get JWT_SECRET(): string {
    return this.loadConfig().JWT_SECRET
  }

  /** Gets the JWT secret key for access tokens */
  get JWT_ACCESS_TOKEN_SECRET(): string {
    return this.loadConfig().JWT_ACCESS_TOKEN_SECRET
  }

  /** Gets the JWT secret key for refresh tokens */
  get JWT_REFRESH_TOKEN_SECRET(): string {
    return this.loadConfig().JWT_REFRESH_TOKEN_SECRET
  }

  /** Gets the JWT secret key for email verification tokens */
  get JWT_EMAIL_VERIFY_TOKEN_SECRET(): string {
    return this.loadConfig().JWT_EMAIL_VERIFY_TOKEN_SECRET
  }

  /** Gets the JWT secret key for password reset tokens */
  get JWT_FORGOT_PASSWORD_TOKEN_SECRET(): string {
    return this.loadConfig().JWT_FORGOT_PASSWORD_TOKEN_SECRET
  }

  /** Gets the expiration time for access tokens */
  get JWT_ACCESS_TOKEN_EXPIRES_IN(): string {
    return this.loadConfig().JWT_ACCESS_TOKEN_EXPIRES_IN
  }

  /** Gets the expiration time for refresh tokens */
  get JWT_REFRESH_TOKEN_EXPIRES_IN(): string {
    return this.loadConfig().JWT_REFRESH_TOKEN_EXPIRES_IN
  }

  /** Gets the expiration time for email verification tokens */
  get JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN(): string {
    return this.loadConfig().JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN
  }

  /** Gets the expiration time for password reset tokens */
  get JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN(): string {
    return this.loadConfig().JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN
  }

  /** Gets the algorithm used for JWT signing */
  get JWT_ALGORITHM(): string {
    return this.loadConfig().JWT_ALGORITHM
  }
}
