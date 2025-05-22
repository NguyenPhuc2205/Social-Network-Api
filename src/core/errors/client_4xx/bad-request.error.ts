/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-15 12:20:28
 * @FilePath      : /server/src/core/errors/client_4xx/bad-request.error.ts
 * @Description   : BadRequestError class for handling 400 Bad Request errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { TranslationKeys, TRANSLATION_KEYS } from '~/shared/types'

/**
 * Bad Request Error (400)
 * 
 * @class BadRequestError
 * @extends {AppError}
 * @description Used when the request contains invalid parameters or is malformed.
 * This indicates that the server cannot or will not process the request due to something
 * that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, 
 * or deceptive request routing).
 * 
 * @example
 * ```typescript
 * throw new BadRequestError({
 *   message: 'The request contains invalid parameters',
 *   metadata: { 
 *     invalidParams: ['email', 'password'],
 *     reason: 'Missing required fields'
 *   }
 * })
 * ```
 */
@injectable()
export class BadRequestError extends AppError {
  constructor(options: {
    message: string,
    translationKey?: TranslationKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      translationKey: options.translationKey || TRANSLATION_KEYS.BAD_REQUEST || 'common:BAD_REQUEST',
      message: options.message,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: options.code || RESPONSE_CODES.BAD_REQUEST.code,
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
