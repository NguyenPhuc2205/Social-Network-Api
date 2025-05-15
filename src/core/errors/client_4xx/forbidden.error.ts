/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-15 10:15:30
 * @FilePath      : /server/src/core/errors/client_4xx/forbidden.error.ts
 * @Description   : ForbiddenError class for handling 403 Forbidden errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Forbidden Error (403)
 * 
 * @class ForbiddenError
 * @extends {AppError}
 * @description Used when the server understands the request but refuses to authorize it.
 * Unlike UnauthorizedError which indicates missing authentication, 
 * this error indicates that authentication was provided but the authenticated user 
 * does not have access to the requested resource.
 * 
 * @example
 * ```typescript
 * throw new ForbiddenError({
 *   message: 'You do not have permission to access this resource',
 *   metadata: { 
 *     requiredRole: 'admin',
 *     userRole: 'user',
 *     resourceId: '12345'
 *   }
 * })
 * ```
 */
@injectable()
export class ForbiddenError extends AppError {
  constructor(options: {
    message: string,
    messageKey?: MessageKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      message: options.message,
      messageKey: MESSAGES.FORBIDDEN || options.messageKey || 'common:FORBIDDEN',
      statusCode: HTTP_STATUS.FORBIDDEN,
      code: options.code || RESPONSE_CODES.FORBIDDEN.code || 'FORBIDDEN',
      metadata: options.metadata,
      requestId: options.requestId
    })
  }
}
