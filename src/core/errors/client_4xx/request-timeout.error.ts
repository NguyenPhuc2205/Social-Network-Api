/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-14 18:00:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-14 12:36:53
 * @FilePath      : /server/src/core/errors/client_4xx/request-timeout.error.ts
 * @Description   : RequestTimeoutError class for handling 408 Request Timeout errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Request Timeout Error (408)
 * 
 * @class RequestTimeoutError
 * @extends {AppError}
 * @description Used when the server did not receive a complete request message within the time it was prepared to wait.
 * This can occur when the client's network connection is slow or when a client starts a request but fails to complete it.
 * 
 * @example
 * ```typescript
 * throw new RequestTimeoutError({
 *   message: 'The request timed out while waiting for the client to complete the request',
 *   metadata: { requestDuration: '30s' }
 * })
 * ```
 */
@injectable()
export class RequestTimeoutError extends AppError {
  constructor(options: {
    message: string,
    messageKey?: MessageKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      messageKey: options.messageKey || MESSAGES.REQUEST_TIMEOUT || 'common:REQUEST_TIMEOUT',
      message: options.message,
      statusCode: HTTP_STATUS.REQUEST_TIMEOUT,
      code: options.code || 'REQUEST_TIMEOUT',
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
