/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-15 10:48:41
 * @FilePath      : /server/src/core/errors/server_5xx/gateway-timeout.error.ts
 * @Description   : GatewayTimeoutError class for handling 504 Gateway Timeout errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Gateway Timeout Error (504)
 * 
 * @class GatewayTimeoutError
 * @extends {AppError}
 * @description Used when the server, while acting as a gateway or proxy, did not receive a timely response
 * from the upstream server or some other auxiliary server it needed to access in order to complete the request.
 * 
 * @example
 * ```typescript
 * throw new GatewayTimeoutError({
 *   message: 'The payment gateway did not respond within the allocated time',
 *   metadata: { 
 *     service: 'payment-gateway', 
 *     timeoutAfter: '30s'
 *   }
 * })
 * ```
 */
@injectable()
export class GatewayTimeoutError extends AppError {
  constructor(options: {
    message: string,
    messageKey?: MessageKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      messageKey: options.messageKey || MESSAGES.GATEWAY_TIMEOUT || 'common:GATEWAY_TIMEOUT',
      message: options.message,
      statusCode: HTTP_STATUS.GATEWAY_TIMEOUT,
      code: options.code || 'GATEWAY_TIMEOUT',
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
