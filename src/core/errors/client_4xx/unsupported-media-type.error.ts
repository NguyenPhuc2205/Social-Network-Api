/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-14 18:00:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-14 18:00:00
 * @FilePath      : /server/src/core/errors/client_4xx/unsupported-media-type.error.ts
 * @Description   : UnsupportedMediaTypeError class for handling 415 Unsupported Media Type errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { TranslationKeys, TRANSLATION_KEYS } from '~/shared/types'

/**
 * Unsupported Media Type Error (415)
 * 
 * @class UnsupportedMediaTypeError
 * @extends {AppError}
 * @description Used when the server refuses to accept the request because the payload format 
 * is in an unsupported format. The format problem might be due to the request's indicated
 * Content-Type or Content-Encoding, or as a result of inspecting the data directly.
 * 
 * @example
 * ```typescript
 * throw new UnsupportedMediaTypeError({
 *   message: 'The media type application/xml is not supported',
 *   metadata: { supportedTypes: ['application/json'] }
 * })
 * ```
 */
@injectable()
export class UnsupportedMediaTypeError extends AppError {  constructor(options: {
    message: string,
    translationKey?: TranslationKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      translationKey: options.translationKey || TRANSLATION_KEYS.UNSUPPORTED_MEDIA_TYPE || 'common:UNSUPPORTED_MEDIA_TYPE',
      message: options.message,
      statusCode: HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
      code: options.code || 'UNSUPPORTED_MEDIA_TYPE',
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
