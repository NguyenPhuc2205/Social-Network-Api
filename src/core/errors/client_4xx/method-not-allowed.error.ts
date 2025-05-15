/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-15 12:20:39
 * @FilePath      : /server/src/core/errors/client_4xx/method-not-allowed.error.ts
 * @Description   : MethodNotAllowedError class for handling 405 Method Not Allowed errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Method Not Allowed Error (405)
 * 
 * @class MethodNotAllowedError
 * @extends {AppError}
 * @description Used when the request method is not supported for the requested resource.
 * For example, if a resource only supports GET and POST, but a client makes a PUT request,
 * this error would be returned.
 * 
 * @example
 * ```typescript
 * throw new MethodNotAllowedError({
 *   message: 'The DELETE method is not allowed for this resource',
 *   metadata: { 
 *     allowedMethods: ['GET', 'POST', 'PATCH'],
 *     requestedMethod: 'DELETE'
 *   }
 * })
 * ```
 */
@injectable()
export class MethodNotAllowedError extends AppError {
  constructor(options: {
    message: string,
    messageKey?: MessageKeys,
    code?: string,
    metadata?: Record<string, any>,
    cause?: Error,
    requestId?: string
  }) {
    super({
      message: options.message,
      messageKey: options.messageKey || MESSAGES.METHOD_NOT_ALLOWED,
      statusCode: HTTP_STATUS.METHOD_NOT_ALLOWED,
      code: options.code || RESPONSE_CODES.METHOD_NOT_ALLOWED?.code || 'METHOD_NOT_ALLOWED',
      metadata: options.metadata,
      cause: options.cause,
      requestId: options.requestId
    })
  }
}
