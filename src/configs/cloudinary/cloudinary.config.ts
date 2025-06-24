/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-30 23:33:08
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-31 00:31:18
 * @FilePath      : /server/src/configs/cloudinary/cloudinary.config.ts
 * @Description   : Cloudinary configuration exports and bindings
 */

import { inject, injectable } from 'inversify'
import { DI_TYPES } from '~/core/providers'
import { IConfigService } from '~/configs/config.interface'

export interface ICloudinaryConfig {
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
  CLOUDINARY_UPLOAD_PRESET?: string
  CLOUDINARY_ASSET_FOLDER?: string
  getCloudinaryConfig(): Record<string, string | undefined>
}

@injectable()
export class CloudinaryConfig implements ICloudinaryConfig {
  private _config: ICloudinaryConfig | null = null

  constructor(
    @inject(DI_TYPES.IConfigService)
    private configService: IConfigService
  ) {}

  private loadConfig(): ICloudinaryConfig {
    if (!this._config) {
      const validatedConfig = this.configService.getConfig()

      this._config = {
        CLOUDINARY_CLOUD_NAME: validatedConfig.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: validatedConfig.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: validatedConfig.CLOUDINARY_API_SECRET,
        CLOUDINARY_UPLOAD_PRESET: validatedConfig.CLOUDINARY_UPLOAD_PRESET,
        CLOUDINARY_ASSET_FOLDER: validatedConfig.CLOUDINARY_ASSET_FOLDER,
        getCloudinaryConfig: this.getCloudinaryConfig.bind(this)
      }
    }

    return this._config
  }

  /** Gets the Cloudinary cloud name */
  get CLOUDINARY_CLOUD_NAME(): string {
    return this.loadConfig().CLOUDINARY_CLOUD_NAME
  }

  /** Gets the Cloudinary API key */
  get CLOUDINARY_API_KEY(): string {
    return this.loadConfig().CLOUDINARY_API_KEY
  }

  /** Gets the Cloudinary API secret */
  get CLOUDINARY_API_SECRET(): string {
    return this.loadConfig().CLOUDINARY_API_SECRET
  }

  /** Gets the Cloudinary upload preset name */
  get CLOUDINARY_UPLOAD_PRESET(): string | undefined {
    return this.loadConfig().CLOUDINARY_UPLOAD_PRESET
  }

  /** Gets the Cloudinary asset folder path */
  get CLOUDINARY_ASSET_FOLDER(): string | undefined {
    return this.loadConfig().CLOUDINARY_ASSET_FOLDER
  }

  /**
   * Builds a Cloudinary configuration object
   * @returns Complete Cloudinary configuration
   */
  getCloudinaryConfig() {
    return {
      CLOUD_NAME: this.CLOUDINARY_CLOUD_NAME,
      API_KEY: this.CLOUDINARY_API_KEY,
      API_SECRET: this.CLOUDINARY_API_SECRET,
      UPLOAD_PRESET: this.CLOUDINARY_UPLOAD_PRESET,
      ASSET_FOLDER: this.CLOUDINARY_ASSET_FOLDER
    }
  }
}
