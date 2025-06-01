/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-30 18:01:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-31 00:31:33
 * @FilePath      : /server/src/configs/cloudinary/index.ts
 * @Description   : Cloudinary configuration exports and bindings
 */

import { BindingCallback, DI_TYPES } from '~/core/providers'
import { ICloudinaryConfig, CloudinaryConfig } from '~/configs/cloudinary/cloudinary.config'

export {
  cloudinaryEnvSchema,
  CloudinaryEnvSchema
} from '~/configs/cloudinary/cloudinary.env-schema'

export {
  ICloudinaryConfig,
  CloudinaryConfig
} from '~/configs/cloudinary/cloudinary.config'

export const bindCloudinaryConfig: BindingCallback = (container) => {
  container.bind<ICloudinaryConfig>(DI_TYPES.ICloudinaryConfig).to(CloudinaryConfig).inSingletonScope()
}
