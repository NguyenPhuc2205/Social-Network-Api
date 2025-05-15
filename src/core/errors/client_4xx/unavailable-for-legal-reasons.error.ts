/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-14 18:00:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-14 18:00:00
 * @FilePath      : /server/src/core/errors/client_4xx/unavailable-for-legal-reasons.error.ts
 * @Description   : UnavailableForLegalReasonsError class for handling 451 Unavailable For Legal Reasons errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Unavailable For Legal Reasons Error (451)
 * 
 * @class UnavailableForLegalReasonsError
 * @extends {AppError}
 * @description Used when a server operator has received a legal demand to deny access to a resource or to a set of resources
 * that includes the requested resource. The code 451 was chosen as a reference to Ray Bradbury's novel "Fahrenheit 451".
 * 
 * @example
 * ```typescript
 * throw new UnavailableForLegalReasonsError({
 *   message: 'This content is not available in your region due to legal restrictions',
 *   metadata: { 
 *     legalAuthority: 'Example Copyright Agency',
 *     blockingReference: 'Copyright Law Section 512'
 *   }
 * })
 * ```
 */
@injectable()
export class UnavailableForLegalReasonsError extends AppError {
  constructor(options: {
    message: string,
    messageKey?: MessageKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      messageKey: options.messageKey || MESSAGES.UNAVAILABLE_FOR_LEGAL_REASONS || 'common:UNAVAILABLE_FOR_LEGAL_REASONS',
      message: options.message,
      statusCode: HTTP_STATUS.UNAVAILABLE_FOR_LEGAL_REASONS,
      code: options.code || 'UNAVAILABLE_FOR_LEGAL_REASONS',
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
