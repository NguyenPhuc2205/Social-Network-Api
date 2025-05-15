/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-14 18:00:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-14 18:00:00
 * @FilePath      : /server/src/core/errors/client_4xx/unprocessable-entity.error.ts
 * @Description   : UnprocessableEntityError class for handling 422 Unprocessable Entity errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Unprocessable Entity Error (422)
 * 
 * @class UnprocessableEntityError
 * @extends {AppError}
 * @description Used when the server understands the content type of the request entity, 
 * and the syntax of the request entity is correct, but was unable to process the contained
 * instructions. Often used for semantic errors in the request payload.
 * 
 * @example
 * ```typescript
 * throw new UnprocessableEntityError({
 *   message: 'The request was well-formed but semantically incorrect',
 *   metadata: { 
 *     errors: [
 *       { field: 'date', message: 'Cannot set appointment in the past' }
 *     ] 
 *   }
 * })
 * ```
 */
@injectable()
export class UnprocessableEntityError extends AppError {
  constructor(options: {
    message: string,
    messageKey?: MessageKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      messageKey: options.messageKey || MESSAGES.UNPROCESSABLE_ENTITY || 'common:UNPROCESSABLE_ENTITY',
      message: options.message,
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      code: options.code || RESPONSE_CODES.VALIDATION_ERROR.code,
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
