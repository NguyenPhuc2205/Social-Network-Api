/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-14 18:00:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-14 12:45:11
 * @FilePath      : /server/src/core/errors/server_5xx/not-implemented.error.ts
 * @Description   : NotImplementedError class for handling 501 Not Implemented errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Not Implemented Error (501)
 * 
 * @class NotImplementedError
 * @extends {AppError}
 * @description Used when the server does not support the functionality required to fulfill the request.
 * This is the appropriate response when the server does not recognize the request method and is not capable
 * of supporting it for any resource.
 * 
 * @example
 * ```typescript
 * throw new NotImplementedError({
 *   message: 'The PATCH method is not implemented for this resource',
 *   metadata: { supportedMethods: ['GET', 'POST'] }
 * })
 * ```
 */
@injectable()
export class NotImplementedError extends AppError {
  constructor(options: {
    message: string,
    messageKey?: MessageKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      messageKey: options.messageKey || MESSAGES.NOT_IMPLEMENTED || 'common:NOT_IMPLEMENTED',
      message: options.message,
      statusCode: HTTP_STATUS.NOT_IMPLEMENTED,
      code: options.code || 'NOT_IMPLEMENTED',
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
