/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-14 18:00:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-14 12:45:59
 * @FilePath      : /server/src/core/errors/client_4xx/gone.error.ts
 * @Description   : GoneError class for handling 410 Gone errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Gone Error (410)
 * 
 * @class GoneError
 * @extends {AppError}
 * @description Used when the requested resource is no longer available at the server and no forwarding address is known.
 * This condition is expected to be permanent, unlike NotFoundError which might be temporary.
 * 
 * @example
 * ```typescript
 * throw new GoneError({
 *   message: 'The API version v1 is no longer supported',
 *   metadata: { suggestedVersion: 'v2' }
 * })
 * ```
 */
@injectable()
export class GoneError extends AppError {
  constructor(options: {
    message: string,
    messageKey?: MessageKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      messageKey: options.messageKey || MESSAGES.GONE || 'common:GONE',
      message: options.message,
      statusCode: HTTP_STATUS.GONE,
      code: options.code || 'GONE',
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
