/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-15 10:48:41
 * @FilePath      : /server/src/core/errors/client_4xx/unauthorized.error.ts
 * @Description   : UnauthorizedError class for handling 401 Unauthorized errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { TranslationKeys, TRANSLATION_KEYS } from '~/shared/types'

/**
 * Unauthorized Error (401)
 * 
 * @class UnauthorizedError
 * @extends {AppError}
 * @description Used when authentication is required and has failed or has not been provided.
 * This is the appropriate response when a client attempts to access a protected resource
 * without providing valid authentication credentials.
 * 
 * @example
 * ```typescript
 * throw new UnauthorizedError({
 *   message: 'Invalid or expired authentication token',
 *   metadata: { 
 *     reason: 'token_expired',
 *     expiredAt: '2025-05-15T10:30:00Z'
 *   }
 * })
 * ```
 */
@injectable()
export class UnauthorizedError extends AppError {
  constructor(options: {
    message: string;
    translationKey?: TranslationKeys;
    code?: string;
    metadata?: Record<string, any>;
    requestId?: string;
  }) {
    super({
      translationKey: options.translationKey || TRANSLATION_KEYS.UNAUTHORIZED,
      message: options.message,
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      code: options.code || RESPONSE_CODES.UNAUTHORIZED.code,
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
