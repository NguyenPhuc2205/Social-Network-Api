/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-15 12:44:48
 * @FilePath      : /server/src/core/errors/client_4xx/validation.error.ts
 * @Description   : ValidationError class for handling 422 Unprocessable Entity errors
 */

import { injectable } from 'inversify'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { IValidationErrorDetail } from '~/shared/interfaces'
import { TranslationKeys, TRANSLATION_KEYS } from '~/shared/types'

/**
 * Validation Error (422)
 * 
 * @class ValidationError
 * @extends {AppError}
 * @description Used when request data fails validation rules. This extends the basic
 * UnprocessableEntityError to provide more detailed validation error information for each field.
 * It includes specific error details for each invalid field in the request.
 * 
 * @example
 * ```typescript
 * throw new ValidationError({
 *   message: 'Validation errors',
 *   errors: {
 *     email: {
 *       message: 'Invalid email format',
 *       translationKey: 'common:INVALID_EMAIL',
 *     },
 *     age: {
 *       message: 'Age must be at least 18',
 *       translationKey: 'common:AGE_TOO_LOW',
 *     }
 *   }
 * })
 * ```
 */
@injectable()
export class ValidationError extends AppError {
  public readonly errors: Record<string, IValidationErrorDetail>

  constructor(options: {
    message: string,
    translationKey?: TranslationKeys,
    errors: Record<string, IValidationErrorDetail>,
    code?: string,
    metadata?: Record<string, any>,
    requestId?: string
  }) {
    super({
      message: options.message,
      translationKey: TRANSLATION_KEYS.VALIDATION_ERROR || options.translationKey || 'common:VALIDATION_ERROR',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      code: RESPONSE_CODES.VALIDATION_ERROR.code || options.code || 'VALIDATION_ERROR',
      metadata: options.metadata,
      requestId: options.requestId,
    })

    this.errors = options.errors
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    }
  }
}
