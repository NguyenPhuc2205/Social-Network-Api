/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-06 21:43:17
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-15 12:23:35
 * @FilePath      : /server/src/core/errors/server_5xx/internal-server.error.ts
 * @Description   : InternalServerError class for handling 500 Internal Server Error
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors/app.error'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Internal Server Error (500)
 * 
 * @class InternalServerError
 * @extends {AppError}
 * @description Used when the server encountered an unexpected condition that prevented it from fulfilling the request.
 * This is a generic server error response when no more specific 5xx error is applicable.
 * It indicates that something went wrong on the server, but the exact nature of the problem is not known or not exposed
 * for security reasons.
 * 
 * @example
 * ```typescript
 * throw new InternalServerError({
 *   message: 'An unexpected error occurred while processing the request',
 *   metadata: { 
 *     errorId: 'ERR12345',
 *     component: 'PaymentProcessor'
 *   }
 * })
 * ```
 */
@injectable()
export class InternalServerError extends AppError {
  constructor(options: {
    message: string,
    messageKey?: MessageKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      message: options.message,
      messageKey: options.messageKey || MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      code: options.code || RESPONSE_CODES.INTERNAL_SERVER_ERROR.code || 'INTERNAL_SERVER_ERROR',
      metadata: options.metadata,
      requestId: options.requestId
    })
  }
}
