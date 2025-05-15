/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-14 18:00:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-14 18:00:00
 * @FilePath      : /server/src/core/errors/server_5xx/bad-gateway.error.ts
 * @Description   : BadGatewayError class for handling 502 Bad Gateway errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Bad Gateway Error (502)
 * 
 * @class BadGatewayError
 * @extends {AppError}
 * @description Used when the server, while acting as a gateway or proxy, received an invalid response
 * from the upstream server it accessed in attempting to fulfill the request.
 * 
 * @example
 * ```typescript
 * throw new BadGatewayError({
 *   message: 'Invalid response received from the upstream payment service',
 *   metadata: { 
 *     service: 'payment-api', 
 *     upstreamStatus: 400,
 *     upstreamMessage: 'Malformed request'
 *   }
 * })
 * ```
 */
@injectable()
export class BadGatewayError extends AppError {
  constructor(options: {
    message: string,
    messageKey?: MessageKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      messageKey: options.messageKey || MESSAGES.BAD_GATEWAY || 'common:BAD_GATEWAY',
      message: options.message,
      statusCode: HTTP_STATUS.BAD_GATEWAY,
      code: options.code || 'BAD_GATEWAY',
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
