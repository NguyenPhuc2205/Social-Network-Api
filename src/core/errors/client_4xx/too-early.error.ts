/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-14 18:00:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-14 18:00:00
 * @FilePath      : /server/src/core/errors/client_4xx/too-early.error.ts
 * @Description   : TooEarlyError class for handling 425 Too Early errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { TranslationKeys, TRANSLATION_KEYS } from '~/shared/types'

/**
 * Too Early Error (425)
 * 
 * @class TooEarlyError
 * @extends {AppError}
 * @description Used when the server is unwilling to risk processing a request that might be replayed.
 * This is typically related to security concerns with requests sent during TLS handshake
 * negotiation before the connection is fully established.
 * 
 * @example
 * ```typescript
 * throw new TooEarlyError({
 *   message: 'The request cannot be processed because the TLS connection is not fully established',
 *   metadata: { suggestedAction: 'Retry after TLS handshake is complete' }
 * })
 * ```
 */
@injectable()
export class TooEarlyError extends AppError {  constructor(options: {
    message: string,
    translationKey?: TranslationKeys,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      translationKey: options.translationKey || TRANSLATION_KEYS.TOO_EARLY || 'common:TOO_EARLY',
      message: options.message,
      statusCode: HTTP_STATUS.TOO_EARLY,
      code: options.code || 'TOO_EARLY',
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }
}
