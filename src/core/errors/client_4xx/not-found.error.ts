/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-15 12:21:29
 * @FilePath      : /server/src/core/errors/client_4xx/not-found.error.ts
 * @Description   : NotFoundError class for handling 404 Not Found errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { TranslationKeys, TRANSLATION_KEYS } from '~/shared/types'

/**
 * Not Found Error (404)
 * 
 * @class NotFoundError
 * @extends {AppError}
 * @description Used when the server cannot find the requested resource.
 * This is commonly used when a requested entity (document, file, record) 
 * doesn't exist in the system.
 * 
 * @example
 * ```typescript
 * throw new NotFoundError({
 *   message: 'User with ID 12345 not found',
 *   metadata: { userId: '12345', resource: 'User' }
 * })
 * ```
 */
@injectable()
export class NotFoundError extends AppError {
  constructor(options: {
    message: string,
    translationKey?: TranslationKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      message: options.message,
      translationKey: TRANSLATION_KEYS.NOT_FOUND || options.translationKey || 'common:NOT_FOUND',
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: options.code || RESPONSE_CODES.NOT_FOUND.code || 'NOT_FOUND',
      metadata: options.metadata,
      requestId: options.requestId
    })
  }
}
