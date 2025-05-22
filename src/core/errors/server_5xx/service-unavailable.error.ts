/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-15 12:27:43
 * @FilePath      : /server/src/core/errors/server_5xx/service-unavailable.error.ts
 * @Description   : ServiceUnavailableError class for handling 503 Service Unavailable errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors/app.error'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { TranslationKeys, TRANSLATION_KEYS } from '~/shared/types'

/**
 * Service Unavailable Error (503)
 * 
 * @class ServiceUnavailableError
 * @extends {AppError}
 * @description Used when the server is currently unable to handle the request due to temporary overloading or maintenance of the server.
 * This typically indicates a temporary condition which will be alleviated after some delay.
 * Common scenarios include server maintenance, overloaded systems, or dependent service failure.
 * 
 * @example
 * ```typescript
 * throw new ServiceUnavailableError({
 *   message: 'The service is temporarily unavailable due to scheduled maintenance',
 *   metadata: { 
 *     retryAfter: 3600, // seconds
 *     maintenanceWindow: {
 *       start: '2025-05-15T10:00:00Z',
 *       end: '2025-05-15T11:00:00Z'
 *     },
 *     affectedServices: ['payment-processing']
 *   }
 * })
 * ```
 */
@injectable()
export class ServiceUnavailableError extends AppError {
  constructor(options: {
    message: string,
    translationKey?: TranslationKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      message: options.message,
      translationKey: options.translationKey || TRANSLATION_KEYS.SERVICE_UNAVAILABLE || 'common:SERVICE_UNAVAILABLE',
      statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
      code: options.code || RESPONSE_CODES.SERVICE_UNAVAILABLE.code || 'SERVICE_UNAVAILABLE',
      metadata: options.metadata,
      requestId: options.requestId
    })
  }
}
