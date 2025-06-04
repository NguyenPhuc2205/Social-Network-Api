/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-26 09:56:35
 * @FilePath      : /server/src/common/utils/zod-validator-core.ts
 * @Description   : Comprehensive Zod validation utilities with i18n support, error mapping, and structured logging
 */

import { HTTP_STATUS } from '~/shared/constants'
import { TRANSLATION_KEYS } from '~/shared/types'
import { ParseParams, ZodIssue, ZodSchema } from 'zod'
import { IValidationErrorDetail, IValidationOptions } from '~/shared/interfaces'
import { translate } from '~/infrastructure/i18n'

/**
 * Default validation options for Zod validation.
 * These options control how validation errors are handled and formatted
 */
export const DEFAULT_VALIDATION_OPTIONS: IValidationOptions = {
  abortEarly: false, // Continue validation after first error to collect all errors
  attachValidated: true, // Attach validated data to the request object
  formatErrors: true, // Format errors with detailed information
  errorMessage: translate(TRANSLATION_KEYS.VALIDATION_ERROR), // Default error message for validation failures
  errorStatusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, // HTTP status code for validation errors
  logErrors: true // Enable logging of validation errors for debugging
}

/**
 * Validates data against a Zod schema with comprehensive error handling and logging
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @param options - Optional validation configuration
 * @returns Promise resolving to validated data
 * @throws ZodError if validation fails
 */
export const validateZodSchema = async <T>(
  schema: ZodSchema<T>,
  data: any,
  options: IValidationOptions = {}
): Promise<T> => {
  const mergedOptions = { ...DEFAULT_VALIDATION_OPTIONS, ...options }
  const parseConfig: Partial<ParseParams> = { async: true }

  if (mergedOptions.abortEarly) {
    parseConfig.errorMap = (issue, ctx) => {
      // Custom error map to handle abortEarly behavior
      return {
        message: ctx.defaultError,
        fatal: true, // Stop on first error
      }
    }
  }

  return await schema.parseAsync(data, parseConfig)
}
