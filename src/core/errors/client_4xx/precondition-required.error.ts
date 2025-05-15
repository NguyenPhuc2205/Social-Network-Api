/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-14 18:00:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-14 18:00:00
 * @FilePath      : /server/src/core/errors/client_4xx/precondition-required.error.ts
 * @Description   : PreconditionRequiredError class for handling 428 Precondition Required errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Precondition Required Error (428)
 * 
 * @class PreconditionRequiredError
 * @extends {AppError}
 * @description Used when the server requires the request to be conditional. 
 * Typically used to prevent the "lost update" problem, where a client GETs a resource,
 * modifies it, and PUTs it back to the server, when meanwhile a third party has modified
 * the resource on the server, leading to a conflict.
 * 
 * @example
 * ```typescript
 * throw new PreconditionRequiredError({
 *   message: 'Precondition required for this request',
 *   metadata: { 
 *     requiredHeaders: ['If-Match', 'If-Unmodified-Since'],
 *     resourceInfo: 'Use GET to retrieve current ETag first'
 *   }
 * })
 * ```
 */
@injectable()
export class PreconditionRequiredError extends AppError {
  constructor(options: {
    message: string,
    messageKey?: MessageKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      messageKey: options.messageKey || MESSAGES.PRECONDITION_REQUIRED || 'common:PRECONDITION_REQUIRED',
      message: options.message,
      statusCode: HTTP_STATUS.PRECONDITION_REQUIRED,
      code: options.code || 'PRECONDITION_REQUIRED',
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
