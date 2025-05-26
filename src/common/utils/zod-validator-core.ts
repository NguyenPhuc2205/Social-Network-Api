/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-25 20:10:41
 * @FilePath      : /server/src/common/utils/zod-validator-core.ts
 * @Description   : Comprehensive Zod validation utilities with i18n support, error mapping, and structured logging
 */

import { Request } from 'express'
import { HTTP_STATUS } from '~/shared/constants'
import { ErrorSeverity, RequestSource, TRANSLATION_KEYS } from '~/shared/types'
import { ParseParams, StringValidation, ZodError, ZodIssue, ZodIssueCode, ZodSchema } from 'zod'
import { Container } from 'inversify'
import { DI_TYPES, DIContainer } from '~/core/providers'
import { IWinstonLoggerService } from '~/infrastructure/loggers'
import { IFormattedValidationError, IValidationErrorDetail, IValidationOptions } from '~/shared/interfaces'
import { ValidationTranslationKeys, SuggestionTranslationKeys } from '~/shared/enums'
import { II18nService } from '~/infrastructure/i18n'
import { getCallerLocation } from '~/common/helpers'

// Initialize DI container and services
const container: Container = DIContainer.getInstance().getContainer()
const loggerService: IWinstonLoggerService = container.get<IWinstonLoggerService>(DI_TYPES.IWinstonLoggerService)
const i18nService: II18nService = container.get<II18nService>(DI_TYPES.II18nService)

/**
 * Default validation options for Zod validation.
 * These options control how validation errors are handled and formatted
 */
export const DEFAULT_VALIDATION_OPTIONS: IValidationOptions = {
  abortEarly: false, // Continue validation after first error to collect all errors
  attachValidated: true, // Attach validated data to the request object
  formatErrors: true, // Format errors with detailed information
  errorMessage: i18nService.translate(TRANSLATION_KEYS.VALIDATION_ERROR), // Default error message for validation failures
  errorStatusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, // HTTP status code for validation errors
  logErrors: true // Enable logging of validation errors for debugging
}

/**
 * Field-specific validation mapping
 * Highest priority - these mappings override general error code mappings
 * Structure: { fieldName: { zodErrorCode: translationKey } }
 */
export const FIELD_SPECIFIC_MAP: Record<string, Record<string, ValidationTranslationKeys>> = {
  email: {
    invalid_string: ValidationTranslationKeys.EMAIL_INVALID_FORMAT,
    required_error: ValidationTranslationKeys.REQUIRED
  },
  password: {
    too_small: ValidationTranslationKeys.PASSWORD_WEAK,
    custom: ValidationTranslationKeys.PASSWORD_COMPLEXITY,
    required_error: ValidationTranslationKeys.REQUIRED
  },
  username: {
    invalid_string: ValidationTranslationKeys.USERNAME_INVALID_FORMAT,
    too_small: ValidationTranslationKeys.MIN_LENGTH,
    too_big: ValidationTranslationKeys.MAX_LENGTH
  },
  phone: {
    invalid_string: ValidationTranslationKeys.PHONE_INVALID_FORMAT
  },
  dateOfBirth: {
    invalid_date: ValidationTranslationKeys.DATE_OF_BIRTH_INVALID_FORMAT,
    too_small: ValidationTranslationKeys.DATE_OF_BIRTH_TOO_YOUNG,
    too_big: ValidationTranslationKeys.DATE_OF_BIRTH_TOO_OLD
  },
  bio: {
    too_big: ValidationTranslationKeys.BIO_LENGTH
  },
  website: {
    invalid_string: ValidationTranslationKeys.URL_INVALID,
    too_big: ValidationTranslationKeys.WEBSITE_LENGTH
  },
  location: {
    too_big: ValidationTranslationKeys.LOCATION_LENGTH
  },
  avatar: {
    invalid_string: ValidationTranslationKeys.AVATAR_INVALID_FORMAT
  },
  cover: {
    invalid_string: ValidationTranslationKeys.COVER_INVALID_FORMAT
  }
}

/**
 * Mapping for invalid_string validation types.
 * Maps specific string validation types to their corresponding translation keys
 */
export const INVALID_STRING_VALIDATION_MAP: Record<string, ValidationTranslationKeys> = {
  email: ValidationTranslationKeys.EMAIL_INVALID,
  url: ValidationTranslationKeys.URL_INVALID,
  uuid: ValidationTranslationKeys.UUID_INVALID,
  cuid: ValidationTranslationKeys.CUID_INVALID,
  regex: ValidationTranslationKeys.REGEX_INVALID,
  datetime: ValidationTranslationKeys.DATE_INVALID,
  ip: ValidationTranslationKeys.FORMAT_INVALID,
  emoji: ValidationTranslationKeys.FORMAT_INVALID,
  ulid: ValidationTranslationKeys.FORMAT_INVALID,
  base64: ValidationTranslationKeys.FORMAT_INVALID,
  nanoid: ValidationTranslationKeys.FORMAT_INVALID,
  includes: ValidationTranslationKeys.FORMAT_INVALID,
  startsWith: ValidationTranslationKeys.FORMAT_INVALID,
  endsWith: ValidationTranslationKeys.FORMAT_INVALID,
  default: ValidationTranslationKeys.FORMAT_INVALID
} as const // Use 'as const' to ensure TypeScript treats this as a readonly object with literal types

/**
 * Mapping for all Zod error codes to their corresponding translation keys.
 * This serves as the fallback mapping when field-specific mappings are not found
 */
export const ZOD_ERROR_CODE_MAP: Record<ZodIssueCode, ValidationTranslationKeys> = {
  invalid_type: ValidationTranslationKeys.TYPE_MISMATCH,
  invalid_literal: ValidationTranslationKeys.LITERAL_MISMATCH,
  custom: ValidationTranslationKeys.CUSTOM_VALIDATION,
  invalid_union: ValidationTranslationKeys.INVALID,
  invalid_union_discriminator: ValidationTranslationKeys.INVALID,
  invalid_enum_value: ValidationTranslationKeys.ENUM_INVALID,
  unrecognized_keys: ValidationTranslationKeys.UNEXPECTED_KEYS,
  invalid_arguments: ValidationTranslationKeys.INVALID,
  invalid_return_type: ValidationTranslationKeys.INVALID,
  invalid_date: ValidationTranslationKeys.DATE_INVALID,
  invalid_string: ValidationTranslationKeys.FORMAT_INVALID,
  too_small: ValidationTranslationKeys.MIN_VALUE,
  too_big: ValidationTranslationKeys.MAX_VALUE,
  invalid_intersection_types: ValidationTranslationKeys.INVALID,
  not_multiple_of: ValidationTranslationKeys.NUMERIC_INVALID,
  not_finite: ValidationTranslationKeys.NUMERIC_INVALID,
}

/**
 * Maps Zod error codes to ValidationTranslationKeys with field-specific overrides
 * Uses a priority system: field-specific > validation-specific > general mapping
 * @param code - The Zod error code to map
 * @param validation - Optional validation type for specific string validations (email, url, etc.)
 * @param fieldPath - Optional field path array to enable field-specific mappings
 * @returns The corresponding ValidationTranslationKeys for the error
 */
export const mapZodErrorCodeToTranslationKey = (
  code: ZodIssueCode,
  validation?: string | StringValidation,
  fieldPath?: string[]
): ValidationTranslationKeys => {
  // Extract the field name from the path (use the last element as field name)
  const fieldName = fieldPath && fieldPath.length > 0 ? fieldPath[fieldPath.length - 1].toString() : ''

  // Priority 1: Check field-specific overrides first (highest priority)
  if (fieldName && FIELD_SPECIFIC_MAP[fieldName]?.[code]) {
    return FIELD_SPECIFIC_MAP[fieldName][code]
  }

  // Priority 2: Handle invalid_string validation type separately
  let validationKey: string
  if (code === 'invalid_string' && validation) {
    if (typeof validation === 'string') {
      validationKey = validation  // Simple string types like 'email', 'url'
    } else {
      // Handle complex StringValidation object types (e.g., includes, startsWith, endsWith)
      if ('includes' in validation) {
        validationKey = 'includes'
      } else if ('startsWith' in validation) {
        validationKey = 'startsWith'
      } else if ('endsWith' in validation) {
        validationKey = 'endsWith'
      } else {
        validationKey = 'default' // Fallback for unknown validation types
      }
    }

    // Check for specific invalid_string mappings first
    const specificKey = INVALID_STRING_VALIDATION_MAP[validationKey]
    if (specificKey) return specificKey

    // If no specific mapping found, check field-specific overrides for invalid_string
    if (fieldName && FIELD_SPECIFIC_MAP[fieldName]?.invalid_string) {
      return FIELD_SPECIFIC_MAP[fieldName].invalid_string
    }
  }

  // Special handling for size validation errors with field-specific logic
  if (code === 'too_small') {
    if (fieldName === 'password') {
      return ValidationTranslationKeys.PASSWORD_WEAK
    }
    return ValidationTranslationKeys.MIN_VALUE
  }

  if (code === 'too_big') {
    // Field-specific length validations
    if (fieldName === 'bio') return ValidationTranslationKeys.BIO_LENGTH
    if (fieldName === 'website') return ValidationTranslationKeys.WEBSITE_LENGTH  
    if (fieldName === 'location') return ValidationTranslationKeys.LOCATION_LENGTH
    return ValidationTranslationKeys.MAX_LENGTH
  }

  // Priority 3: Fallback to general mapping
  return ZOD_ERROR_CODE_MAP[code] ?? ValidationTranslationKeys.UNKNOWN_VALIDATION
}

/**
 * Extracts additional details from a ZodIssue, excluding common properties.
 * @param error - Zod issue object
 * @returns Extracted details
 */
export const extractZodErrorDetails = (error: ZodIssue): Record<string, any> => {
  const { message, path, code, fatal, ...remainingDetails } = error
  return remainingDetails
}

/**
 * Determines the severity of a validation error based on its code and field path.
 * @param code - The Zod error code
 * @param fieldPath - Array of field path segments
 * @returns ErrorSeverity - 'high', 'medium', or 'low'
 */
export const getErrorSeverity = (code: ZodIssueCode, fieldPath: string[]): ErrorSeverity => {
  // Get last field name from path
  const fieldName = fieldPath.length > 0 ? fieldPath[fieldPath.length - 1] : ''
  
  // Define critical fields that should have high severity
  const highSeverityFields = ['password', 'email', 'username']
  const highSeverityCodes: ZodIssueCode[] = ['invalid_type', 'custom']
  const mediumSeverityCodes: ZodIssueCode[] = ['invalid_string', 'too_small', 'too_big', 'invalid_enum_value']

  // High severity: critical fields or critical error codes
  if (highSeverityFields.includes(fieldName) || highSeverityCodes.includes(code)) return 'high'
  
  // Medium severity: common validation errors
  if (mediumSeverityCodes.includes(code)) return 'medium'
  
  // Low severity: everything else
  return 'low'
}

/**
 * Generates contextual suggestions for validation errors based on field type and error code
 * @param error - ZodIssue containing error details
 * @param fieldPath - Array representing the path to the field that failed validation
 * @param req - Optional Express request object for internationalization context
 * @returns Array of localized suggestion strings to help users fix the validation error
 */
export const getErrorSuggestions = (error: ZodIssue, fieldPath: string[], req?: Request): string[] => {
  const suggestions: string[] = []
  const fieldName = fieldPath.length > 0 ? fieldPath[fieldPath.length - 1].toString().toLowerCase() : ''

  switch (error.code) {
    case 'invalid_string':
      // Handle string format validations
      if (error.validation === 'email') {
        suggestions.push(i18nService.translate(SuggestionTranslationKeys.EMAIL_FORMAT_HELP, req))
      } else if (error.validation === 'url') {
        suggestions.push(i18nService.translate(SuggestionTranslationKeys.URL_FORMAT_HELP, req))
      } else if (error.validation === 'uuid') {
        suggestions.push(i18nService.translate(SuggestionTranslationKeys.UUID_FORMAT_HELP, req))
      } else {
        // Handle field-specific string validations
        if (fieldName.includes('phone') || fieldName.includes('mobile')) {
          suggestions.push(i18nService.translate(SuggestionTranslationKeys.PHONE_FORMAT_HELP, req))
        } else if (fieldName.includes('date') || fieldName.includes('birth')) {
          suggestions.push(i18nService.translate(SuggestionTranslationKeys.DATE_FORMAT_HELP, req))
        }
      }
      break

    case 'too_small':
      // Handle minimum constraints
      if (error.type === 'string') {
        if (fieldName === 'password') {
          suggestions.push(i18nService.translate(SuggestionTranslationKeys.PASSWORD_MIN_LENGTH, req))
          suggestions.push(i18nService.translate(SuggestionTranslationKeys.PASSWORD_COMPLEXITY, req))
        } else if (fieldName === 'username') {
          suggestions.push(i18nService.translate(SuggestionTranslationKeys.USERNAME_MIN_LENGTH, req))
        } else {
          suggestions.push(i18nService.translate(SuggestionTranslationKeys.STRING_MIN_LENGTH, req, { min: String(error.minimum) }))
        }
      } else if (error.type === 'number') {
        suggestions.push(i18nService.translate(SuggestionTranslationKeys.NUMBER_MIN_VALUE, req, { min: String(error.minimum) }))
      } else if (error.type === 'array') {
        suggestions.push(i18nService.translate(SuggestionTranslationKeys.ARRAY_MIN_ITEMS, req, { min: String(error.minimum) }))
      }
      break

    case 'too_big':
      // Handle maximum constraints
      if (error.type === 'string') {
        if (fieldName === 'bio') {
          suggestions.push(i18nService.translate(SuggestionTranslationKeys.BIO_MAX_LENGTH, req))
        } else if (fieldName === 'website') {
          suggestions.push(i18nService.translate(SuggestionTranslationKeys.WEBSITE_MAX_LENGTH, req))
        } else if (fieldName.includes('location')) {
          suggestions.push(i18nService.translate(SuggestionTranslationKeys.LOCATION_MAX_LENGTH, req))
        } else {
          suggestions.push(i18nService.translate(SuggestionTranslationKeys.STRING_MAX_LENGTH, req, { max: String(error.maximum) }))
        }
      } else if (error.type === 'number') {
        suggestions.push(i18nService.translate(SuggestionTranslationKeys.NUMBER_MAX_VALUE, req, { max: String(error.maximum) }))
      } else if (error.type === 'array') {
        suggestions.push(i18nService.translate(SuggestionTranslationKeys.ARRAY_MAX_ITEMS, req, { max: String(error.maximum) }))
      }
      break

    case 'invalid_type':
      // Handle type mismatches with specific suggestions
      if (error.expected === 'string') {
        suggestions.push(i18nService.translate(SuggestionTranslationKeys.STRING_REQUIRED, req))
      } else if (error.expected === 'number') {
        suggestions.push(i18nService.translate(SuggestionTranslationKeys.NUMBER_REQUIRED, req))
      } else {
        suggestions.push(i18nService.translate(SuggestionTranslationKeys.TYPE_EXPECTED, req, { expected: error.expected }))
      }
      break

    case 'invalid_enum_value':
      // Handle enum validation errors
      suggestions.push(i18nService.translate(SuggestionTranslationKeys.ENUM_VALUES, req, { 
        options: (error as any).options?.join(', ') || 'valid options' 
      }))
      break

    case 'invalid_date':
      // Handle date validation errors
      if (fieldName.includes('birth') || fieldName.includes('birthday')) {
        suggestions.push(i18nService.translate(SuggestionTranslationKeys.DATE_OF_BIRTH_HELP, req))
      } else {
        suggestions.push(i18nService.translate(SuggestionTranslationKeys.DATE_FORMAT_HELP, req))
      }
      break

    case 'custom':
      // Handle custom validation errors
      suggestions.push(i18nService.translate(SuggestionTranslationKeys.CUSTOM_VALIDATION_FAILED, req))
      break

    case 'invalid_literal':
    case 'unrecognized_keys':
    case 'invalid_arguments':
    case 'invalid_return_type':
    case 'invalid_union':
    case 'invalid_union_discriminator':
    case 'invalid_intersection_types':
    case 'not_multiple_of':
    case 'not_finite':
      // Handle other validation errors with generic suggestion
      suggestions.push(i18nService.translate(SuggestionTranslationKeys.CUSTOM_VALIDATION_FAILED, req))
      break

    default:
      // Fallback for required fields
      suggestions.push(i18nService.translate(SuggestionTranslationKeys.FIELD_REQUIRED, req))
      break
  }

  return suggestions
}

/**
 * Generates a comprehensive summary of validation errors
 * @param errors - Record of validation error details keyed by field path
 * @returns Object containing error statistics and analysis
 */
export const generateErrorSummary = (errors: Record<string, IValidationErrorDetail>): {
  totalErrors: number,
  fieldCount: number,
  severityBreakdown: Record<string, number>
  errorTypes: Record<string, number>
  affectedFields: string[]
} => {
  // Return array of key from errors => Get its length
  const totalErrors = Object.keys(errors).length

  // Create a Set of unique field paths to count distinct fields
  const fields = new Set(Object.values(errors).map(e => e.path.join('.')))
  const severityBreakdown: Record<string, number> = { high: 0, medium: 0, low: 0 }
  const errorTypes = {} as Record<string, number>
  const affectedFields: string[] = Array.from(fields)

  // Analyze each error to build summary statistics
  Object.values(errors).forEach(error => {
    severityBreakdown[error.severity]++
    errorTypes[error.code] = (errorTypes[error.code] || 0) + 1
  })

  return {
    totalErrors,
    fieldCount: fields.size,
    severityBreakdown,
    errorTypes,
    affectedFields
  }
}

/**
 * Extracts relevant value from ZodIssue for display purposes
 * @param error - The ZodIssue object containing error details
 * @param originalData - The original data being validated (optional)
 * @returns String representation of the field value for display
 */
export const extractFieldValue = (error: ZodIssue, originalData?: any): string => {
  // originalData

  // If error has no path (__root__ level from refine, superRefine), return 'N/A'
  if (error.path.length === 0) return 'N/A'

  // Try to get actual field value from original data if available
  if (originalData) {
    try {
      let value = originalData
      // Navigate through the path to get the actual value
      for (const pathSegment of error.path) {
        value = value?.[pathSegment]
      }
      // Return the actual value if found, otherwise fall back to path segment
      if (value !== undefined && value !== null) {
        return String(value)
      }
    } catch {
      // Fall back to path segment if navigation fails
    }
  }

  // Fallback: Get value from the last path segment
  return String(error.path[error.path.length - 1])
}

/**
 * Formats a Zod error into a structured format. Include message, path, code, location, type, and details.
 * @param error - Zod error object
 * @param source - Source of the request data
 * @param req - Optional Express request object for internationalization context
 * @param originalData - Optional original data being validated for better error display
 * @returns Formatted validation error
 */
export const formatZodError = (
  error: ZodError, 
  source: RequestSource, 
  req?: Request,
  originalData?: any
): IFormattedValidationError => {
  const formattedErrors: Record<string, IValidationErrorDetail> = {}
  
  // Use a Map to track error counts for path
  const errorCounts = new Map<string, number>()

  error.errors.forEach((err: ZodIssue) => {
    // Create a unique key for each error based on its path (['user', 'email'] => 'user.email', 'email' => 'email')
    // If the path is empty (use 'refine' on z.object or 'superRefine' but not add path), use '__root__' as the key
    const pathKey = err.path.length > 0 ? err.path.map(String).join('.') : '__root__'
    
    // Number of appearances of this path in the error list, default to 0
    const count = errorCounts.get(pathKey) || 0

    // Create a unique key for this error instance 
    // email[0], email[1], etc. for multiple errors on the same field
    const key = count > 0 ? `${pathKey}[${count}]` : pathKey

    // Update the count for this path
    errorCounts.set(pathKey, count + 1)

    // Extract validation type for invalid_string errors
    const validationType = err.code === 'invalid_string' && err.validation
      ? err.validation
      : undefined
      
    // Get the appropriate translation key for this error
    const translationKey = mapZodErrorCodeToTranslationKey(err.code, validationType, err.path.map(String))
    
    // Prepare interpolation values for translation
    const interpolationValues = {
      field: pathKey,
      value: extractFieldValue(err, originalData),
      path: pathKey,
      ...extractZodErrorDetails(err)
    }

    // Translate the error message
    const translatedMessage = i18nService.resolveMessage({
      translationKey,
      message: err.message,
      req,
      interpolationValues
    })

    // Build the formatted error detail
    formattedErrors[key] = {
      message: translatedMessage,
      translationKey,
      path: err.path,
      code: err.code,
      location: source,
      type: err.code,
      details: extractZodErrorDetails(err),
      severity: getErrorSeverity(err.code, err.path.map(String)),
      suggestions: getErrorSuggestions(err, err.path.map(String)),
    }
  })

  return {
    message: i18nService.translate(TRANSLATION_KEYS.VALIDATION_ERROR, req),
    errors: formattedErrors,
    summary: generateErrorSummary(formattedErrors),
  }
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
  // Merge provided options with defaults
  const mergedOptions = { ...DEFAULT_VALIDATION_OPTIONS, ...options }

  try {
    // Configure parse options for async validation
    const parseConfig: Partial<ParseParams> = { async: true }

    // Set up early abort if configured
    if (mergedOptions.abortEarly) {
      parseConfig.errorMap = (issue, ctx) => {
        return { message: ctx.defaultError }
      }
    }

    // Parse and validate the data against the schema
    const result = await schema.parseAsync(data, parseConfig)

    // Log successful validation if enabled
    if (mergedOptions.logErrors) {
      loggerService.debug({
        message: 'Validation Successful',
        context: {
          module: 'ZodValidator',
          method: 'validateZodSchema',
          route: getCallerLocation(),
          action: 'VALIDATE',
        },
        requestId: '-',
      })
    }

    // Return the validated data
    return result
  } catch (error) {
    // Handle and log validation errors
    if (mergedOptions.logErrors && error instanceof ZodError) {
      // Format the Zod error into a structured format with original data for better error display
      const formattedError = formatZodError(error, 'files', undefined, data)
      
      // Log detailed validation errors
      loggerService.error({
        message: 'Validation Failed',
        context: {
          module: 'ZodValidator',
          method: 'validateZodSchema',
          route: getCallerLocation(),
          action: 'VALIDATE'
        },
        requestId: '-',
        metadata: {
          errorCount: error.errors.length,
          errors: error.errors.map((err: ZodIssue) => ({
            message: err.message,
            path: err.path.join('.'),
            code: err.code,
            severity: getErrorSeverity(err.code, err.path.map(String)),
            suggestions: getErrorSuggestions(err, err.path.map(String)),
          })),
          summary: formattedError.summary,
          inputDataKeys: data ? Object.keys(data) : [],
        },
      })
    }
    
    // Re-throw the error for the caller to handle
    throw error
  }
}
