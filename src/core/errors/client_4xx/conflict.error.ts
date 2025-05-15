/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-15 10:15:30
 * @FilePath      : /server/src/core/errors/client_4xx/conflict.error.ts
 * @Description   : ConflictError class for handling 409 Conflict errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Conflict Error (409)
 * 
 * @class ConflictError
 * @extends {AppError}
 * @description Used when a request conflicts with the current state of the server.
 * Typically occurs when trying to create a resource that already exists,
 * or when attempting to update a resource that has been modified since it was last retrieved.
 * 
 * @example
 * ```typescript
 * throw new ConflictError({
 *   message: 'The username is already taken',
 *   metadata: { field: 'username', value: 'puckluvperfume' }
 * })
 * ```
 */
@injectable()
export class ConflictError extends AppError {
  constructor(options: {
    message: string,
    messageKey?: MessageKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      messageKey: options.messageKey || MESSAGES.CONFLICT || 'common:CONFLICT',
      message: options.message,
      statusCode: HTTP_STATUS.CONFLICT,
      code: options.code || RESPONSE_CODES.CONFLICT.code || 'CONFLICT',
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
