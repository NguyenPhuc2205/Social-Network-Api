/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-14 18:00:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-14 18:00:00
 * @FilePath      : /server/src/core/errors/server_5xx/insufficient-storage.error.ts
 * @Description   : InsufficientStorageError class for handling 507 Insufficient Storage errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Insufficient Storage Error (507)
 * 
 * @class InsufficientStorageError
 * @extends {AppError}
 * @description Used when the server is unable to store the representation needed to successfully
 * complete the request. This condition is considered temporary. 
 * Typically related to disk space, database size limits, or quota exceedance.
 * 
 * @example
 * ```typescript
 * throw new InsufficientStorageError({
 *   message: 'Unable to upload file due to insufficient storage space',
 *   metadata: { 
 *     availableSpace: '50MB',
 *     requiredSpace: '200MB',
 *     resourceType: 'user-uploads'
 *   }
 * })
 * ```
 */
@injectable()
export class InsufficientStorageError extends AppError {
  constructor(options: {
    message: string,
    messageKey?: MessageKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      messageKey: options.messageKey || MESSAGES.INSUFFICIENT_STORAGE || 'common:INSUFFICIENT_STORAGE',
      message: options.message,
      statusCode: HTTP_STATUS.INSUFFICIENT_STORAGE,
      code: options.code || 'INSUFFICIENT_STORAGE',
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
