/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-06 21:43:17
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-15 12:46:50
 * @FilePath      : /server/src/core/errors/client_4xx/rate-limit.error.ts
 * @Description   : RateLimitError class for handling 429 Too Many Requests errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { TranslationKeys, TRANSLATION_KEYS } from '~/shared/types'

/**
 * Rate Limit Error (429)
 * 
 * @class RateLimitError
 * @extends {AppError}
 * @description Used when a user has sent too many requests in a given amount of time.
 * This helps protect the API from abuse by limiting how frequently a client can make requests.
 * 
 * @example
 * ```typescript
 * throw new RateLimitError({
 *   message: 'You have exceeded the rate limit for this endpoint',
 *   metadata: { 
 *     retryAfter: 60, // seconds
 *     limit: 100,
 *     remaining: 0,
 *     resetAt: '2025-05-15T12:30:00Z'
 *   }
 * })
 * ```
 */
@injectable()
export class RateLimitError extends AppError {
  constructor(options: {
    message: string;
    translationKey?: TranslationKeys;
    code?: string;
    metadata?: Record<string, any>;
    requestId?: string;
  }) {
    super({
      translationKey: options.translationKey || TRANSLATION_KEYS.RATE_LIMIT_EXCEEDED,
      message: options.message,
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
      code: options.code || RESPONSE_CODES.TOO_MANY_REQUESTS.code,
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
