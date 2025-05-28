/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-03-16 01:02:52
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
<<<<<<<<< Temporary merge branch 1
 * @LastEditTime  : 2025-05-27 23:22:41
 * @FilePath      : /project/server/src/common/middlewares/validation.middleware.ts
=========
 * @LastEditTime  : 2025-05-26 20:41:59
 * @FilePath      : /server/src/common/middlewares/validation.middleware.ts
 * @Description   : Validation Middleware using Zod for Express.js TypeScript (422 Unprocessable Entity Error)
 */

import { inject, injectable } from 'inversify'
import { DI_TYPES } from '~/core/providers'
import { II18nService, translate } from '~/infrastructure/i18n'
import { IWinstonLoggerService } from '~/infrastructure/loggers'
import { TRANSLATION_KEYS, RequestSource, ErrorSeverity } from '~/shared/types'
import { IFormattedValidationError, IValidationErrorDetail, IValidationOptions } from '~/shared/interfaces'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { StringValidation, ZodError, ZodIssue, ZodIssueCode, ZodSchema } from 'zod'
import { NextFunction, Request, Response, RequestHandler } from 'express'
import { AppError, ValidationError } from '~/core/errors'
import { SuggestionTranslationKeys, ValidationTranslationKeys } from '~/shared/enums'
import { validateZodSchema } from '~/common/utils/zod-validator-core'

/**
 * Validation middleware for Express.js using Zod schemas
 * 
 * @class ValidationMiddleware
 * @description 
 * Provides comprehensive request data validation using Zod schemas.
 * Features include internationalized error messages, field-specific validations,
 * error severity classification, helpful user suggestions, and detailed error reporting.
 * Supports validation of multiple request sources (body, query, params, etc.) in a single middleware.
 */
@injectable()
export class ValidationMiddleware {
  /**
   * Default validation options for Zod schema validation.
   * 
   * @private
   * @readonly
   * @type {IValidationOptions}
   * @description
   * Provides sensible defaults for Zod validation including error formatting and status codes.
   */
  private readonly DEFAULT_VALIDATION_OPTIONS: IValidationOptions = {
    abortEarly: false,
    attachValidated: true,
    formatErrors: true,
    errorMessage: translate(TRANSLATION_KEYS.VALIDATION_ERROR),
    errorStatusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    logErrors: true
  }

  /**
   * Field-specific validation mapping
   * 
   * @private
   * @readonly
   * @type {Record<string, Record<string, ValidationTranslationKeys>>}
   * @description
   * Highest priority - these mappings override general error code mappings.
   * Structure: { fieldName: { zodErrorCode: translationKey } }
   */
  private readonly FIELD_SPECIFIC_MAP: Record<string, Record<string, ValidationTranslationKeys>> = {
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
   * 
   * @private
   * @readonly
   * @type {Record<string, ValidationTranslationKeys>}
   * @description
   * Maps specific string validation types to their corresponding translation keys.
   * Used for error message lookup when string validations fail.
   */
  private readonly INVALID_STRING_VALIDATION_MAP: Record<string, ValidationTranslationKeys> = {
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
  }

  /**
   * Mapping for all Zod error codes to their corresponding translation keys.
   * 
   * @private
   * @readonly
   * @type {Record<ZodIssueCode, ValidationTranslationKeys>}
   * @description
   * This serves as the fallback mapping when field-specific mappings are not found.
   * Provides a consistent way to translate Zod error codes to user-friendly messages.
   */
  private readonly ZOD_ERROR_CODE_MAP: Record<ZodIssueCode, ValidationTranslationKeys> = {
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
   * Creates an instance of the validation middleware
   * 
   * @constructor
   * @param {IWinstonLoggerService} loggerService - Logger service for recording validation issues
   * @param {II18nService} i18nService - Internationalization service for error message translation
   */
  constructor(
    @inject(DI_TYPES.IWinstonLoggerService) private loggerService: IWinstonLoggerService,
    @inject(DI_TYPES.II18nService) private i18nService: II18nService
  ) {}

  /**
   * Extracts additional details from a ZodIssue, excluding common properties.
   * 
   * @public
   * @param {ZodIssue} error - Zod issue object containing validation error details
   * @returns {Record<string, any>} Extracted details for use in error messages
   * @description
   * Normalizes property names in error objects for consistent display and interpolation
   * in localized error messages.
   */
  public extractZodErrorDetails = (error: ZodIssue): Record<string, any> => {
    const normalizeInterpolationKey: Record<string, string> = {
      minimum: 'min',
      maximum: 'max',
    }
    const { message, path, code, fatal, ...remainingDetails } = error
    
    const mappedDetails: Record<string, any> = {}

    for (const [key, value] of Object.entries(remainingDetails)) {
      const mappedKey = normalizeInterpolationKey[key] || key
      mappedDetails[mappedKey] = value
    }

    return mappedDetails
  }

  /**
   * Generates a comprehensive summary of validation errors
   * 
   * @public
   * @param {Record<string, IValidationErrorDetail>} errors - Record of validation error details keyed by field path
   * @returns {Object} Object containing error statistics and analysis
   * @description
   * Analyzes a collection of validation errors to provide insights about their types,
   * severity distribution, and affected fields.
   */
  public generateErrorSummary = (errors: Record<string, IValidationErrorDetail>): {
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
   * 
   * @public
   * @param {ZodIssue} error - The ZodIssue object containing error details
   * @param {any} [originalData] - The original data being validated (optional)
   * @returns {string} String representation of the field value for display
   * @description
   * Safely extracts and formats field values from validation errors for
   * consistent display in error messages.
   */
  public extractFieldValue = (error: ZodIssue, originalData?: any): string => {
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
   * Maps Zod error codes to ValidationTranslationKeys with field-specific overrides
   * 
   * @public
   * @param {ZodIssueCode} code - The Zod error code to map
   * @param {string | StringValidation} [validation] - Optional validation type for specific string validations (email, url, etc.)
   * @param {string[]} [fieldPath] - Optional field path array to enable field-specific mappings
   * @returns {ValidationTranslationKeys} The corresponding ValidationTranslationKeys for the error
   * @description
   * Uses a priority system: field-specific > validation-specific > general mapping
   * to determine the most appropriate translation key for a validation error.
   */
  public mapZodErrorCodeToTranslationKey = (
    code: ZodIssueCode,
    validation?: string | StringValidation,
    fieldPath?: string[]
  ): ValidationTranslationKeys => {
    // Extract the field name from the path (use the last element as field name)
    const fieldName = fieldPath && fieldPath.length > 0 ? fieldPath[fieldPath.length - 1].toString() : ''
  
    // Priority 1: Check field-specific overrides first (highest priority)
    if (fieldName && this.FIELD_SPECIFIC_MAP[fieldName]?.[code]) {
      return this.FIELD_SPECIFIC_MAP[fieldName][code]
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
      const specificKey = this.INVALID_STRING_VALIDATION_MAP[validationKey]
      if (specificKey) return specificKey
  
      // If no specific mapping found, check field-specific overrides for invalid_string
      if (fieldName && this.FIELD_SPECIFIC_MAP[fieldName]?.invalid_string) {
        return this.FIELD_SPECIFIC_MAP[fieldName].invalid_string
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
    return this.ZOD_ERROR_CODE_MAP[code] ?? ValidationTranslationKeys.UNKNOWN_VALIDATION
  }

  /**
   * Determines the severity of a validation error based on its code and field path.
   * 
   * @public
   * @param {ZodIssueCode} code - The Zod error code
   * @param {string[]} fieldPath - Array of field path segments
   * @returns {ErrorSeverity} Error severity level - 'high', 'medium', or 'low'
   * @description
   * Classifies validation errors by severity based on field type and error code.
   * Critical fields like passwords and emails or type errors get higher severity.
   */
  public getErrorSeverity = (code: ZodIssueCode, fieldPath: string[]): ErrorSeverity => {
    // Get last field name from path
    const fieldName = fieldPath.length > 0 ? fieldPath[fieldPath.length - 1] : ''
    
    // Define critical fields that should have high severity
    const highSeverityFields = ['password', 'email', 'username']
    const highSeverityCodes: ZodIssueCode[] = ['invalid_type', 'custom']
    const mediumSeverityCodes: ZodIssueCode[] = ['invalid_string', 'too_small', 'too_big', 'invalid_enum_value']
  
    // High severity: critical fields or critical error codes
    if (highSeverityFields.includes(fieldName) || highSeverityCodes.includes(code)) return 'high' as ErrorSeverity
    
    // Medium severity: common validation errors
    if (mediumSeverityCodes.includes(code)) return 'medium' as ErrorSeverity
    
    // Low severity: everything else
    return 'low' as ErrorSeverity
  }

  /**
   * Generates contextual suggestions for validation errors based on field type and error code
   * 
   * @public
   * @param {ZodIssue} error - ZodIssue containing error details
   * @param {string[]} fieldPath - Array representing the path to the field that failed validation
   * @param {Request} [req] - Optional Express request object for internationalization context
   * @returns {string[]} Array of localized suggestion strings to help users fix the validation error
   * @description
   * Provides helpful, context-aware suggestions to guide users in correcting validation
   * errors based on the field type, error code, and application-specific rules.
   */
  public getErrorSuggestions = (error: ZodIssue, fieldPath: string[], req?: Request): string[] => {
    const suggestions: string[] = []
    const fieldName = fieldPath.length > 0 ? fieldPath[fieldPath.length - 1].toString().toLowerCase() : ''
  
    switch (error.code) {
      case 'invalid_string':
        // Handle string format validations
        if (error.validation === 'email') {
          suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.EMAIL_FORMAT_HELP, req))
        } else if (error.validation === 'url') {
          suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.URL_FORMAT_HELP, req))
        } else if (error.validation === 'uuid') {
          suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.UUID_FORMAT_HELP, req))
        } else {
          // Handle field-specific string validations
          if (fieldName.includes('phone') || fieldName.includes('mobile')) {
            suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.PHONE_FORMAT_HELP, req))
          } else if (fieldName.includes('date') || fieldName.includes('birth')) {
            suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.DATE_FORMAT_HELP, req))
          }
        }
        break
  
      case 'too_small':
        // Handle minimum constraints
        if (error.type === 'string') {
          if (fieldName === 'password') {
            suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.PASSWORD_MIN_LENGTH, req))
            suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.PASSWORD_COMPLEXITY, req))
          } else if (fieldName === 'username') {
            suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.USERNAME_MIN_LENGTH, req))
          } else {
            suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.STRING_MIN_LENGTH, req, { min: String(error.minimum) }))
          }
        } else if (error.type === 'number') {
          suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.NUMBER_MIN_VALUE, req, { min: String(error.minimum) }))
        } else if (error.type === 'array') {
          suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.ARRAY_MIN_ITEMS, req, { min: String(error.minimum) }))
        }
        break
  
      case 'too_big':
        // Handle maximum constraints
        if (error.type === 'string') {
          if (fieldName === 'bio') {
            suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.BIO_MAX_LENGTH, req))
          } else if (fieldName === 'website') {
            suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.WEBSITE_MAX_LENGTH, req))
          } else if (fieldName.includes('location')) {
            suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.LOCATION_MAX_LENGTH, req))
          } else {
            suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.STRING_MAX_LENGTH, req, { max: String(error.maximum) }))
          }
        } else if (error.type === 'number') {
          suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.NUMBER_MAX_VALUE, req, { max: String(error.maximum) }))
        } else if (error.type === 'array') {
          suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.ARRAY_MAX_ITEMS, req, { max: String(error.maximum) }))
        }
        break
  
      case 'invalid_type':
        // Handle type mismatches with specific suggestions
        if (error.expected === 'string') {
          suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.STRING_REQUIRED, req))
        } else if (error.expected === 'number') {
          suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.NUMBER_REQUIRED, req))
        } else {
          suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.TYPE_EXPECTED, req, { expected: error.expected }))
        }
        break
  
      case 'invalid_enum_value':
        // Handle enum validation errors
        suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.ENUM_VALUES, req, { 
          options: (error as any).options?.join(', ') || 'valid options' 
        }))
        break
  
      case 'invalid_date':
        // Handle date validation errors
        if (fieldName.includes('birth') || fieldName.includes('birthday')) {
          suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.DATE_OF_BIRTH_HELP, req))
        } else {
          suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.DATE_FORMAT_HELP, req))
        }
        break
  
      case 'custom':
        // Handle custom validation errors
        suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.CUSTOM_VALIDATION_FAILED, req))
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
        suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.CUSTOM_VALIDATION_FAILED, req))
        break
  
      default:
        // Fallback for required fields
        suggestions.push(this.i18nService.translate(SuggestionTranslationKeys.FIELD_REQUIRED, req))
        break
    }
  
    return suggestions
  }

  /**
   * Formats a Zod error into a structured format
   * 
   * @private
   * @param {ZodError} error - Zod error object containing all validation issues
   * @param {RequestSource} source - Source of the request data (body, query, params, headers, cookies)
   * @param {Request} [req] - Optional Express request object for internationalization context
   * @param {any} [originalData] - Optional original data being validated for better error display
   * @returns {IFormattedValidationError} Formatted validation error with structured organization
   * @description
   * Transforms Zod validation errors into a consistent, detailed format with proper
   * internationalization, severity levels, and helpful suggestions for users.
   * Supports multiple errors per field and provides comprehensive error summaries.
   */
  formatZodError = (
    error: ZodError, 
    source: RequestSource, 
    req?: Request,
    originalData?: any
  ): IFormattedValidationError => {
    const formattedErrors: Record<string, IValidationErrorDetail> = {}
    
    // Use a Map to track error counts for each path to handle multiple errors on the same field
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

      // Update the count for this path for future errors on the same field
      errorCounts.set(pathKey, count + 1)

      // Extract validation type for invalid_string errors (email, url, uuid, etc.)
      // This provides more specific context for error messages
      const validationType = err.code === 'invalid_string' && err.validation
        ? err.validation
        : undefined
        
      // Get the appropriate translation key for this error using our priority-based mapping system
      const translationKey = this.mapZodErrorCodeToTranslationKey(err.code, validationType, err.path.map(String))
      
      // Prepare interpolation values for translation with rich context
      const interpolationValues = {
        field: pathKey,                                // Field name for error messages
        value: this.extractFieldValue(err, originalData),   // Actual problematic value
        path: pathKey,                                 // Full path to the field
        ...this.extractZodErrorDetails(err)                 // Additional error details from Zod
      }

      // Translate the error message with i18n support
      const translatedMessage = this.i18nService.resolveMessage({
        translationKey,
        message: err.message,                          // Fallback to Zod's default message
        req,                                           // Request object for language detection
        interpolationValues                            // Context values for the translation
      })

      // Build the comprehensive formatted error detail with all metadata
      formattedErrors[key] = {
        message: translatedMessage,                    // User-friendly localized message
        translationKey,                                // Key used for translation (for debugging)
        path: err.path,                                // Path to the field with error
        code: err.code,                                // Original Zod error code
        location: source,                              // Where the error occurred (body, query, etc.)
        type: err.code,                                // Type of validation error
        details: this.extractZodErrorDetails(err),          // Additional validation details
        severity: this.getErrorSeverity(err.code, err.path.map(String)),  // Error severity classification
        suggestions: this.getErrorSuggestions(err, err.path.map(String)), // Helpful suggestions for fixing
      }
    })

    // Return a complete response with overall message and error summary
    return {
      message: this.i18nService.translate(TRANSLATION_KEYS.VALIDATION_ERROR, req),
      errors: formattedErrors,
      summary: this.generateErrorSummary(formattedErrors),  // Statistical breakdown of errors
    }
  }
  
  /**
   * Middleware to validate request data against a Zod schema
   * 
   * @public
   * @param {ZodSchema<any>} schema - Zod schema to validate against
   * @param {RequestSource} source - Source of the request data (body, query, params, headers, cookies)
   * @param {IValidationOptions} [options={}] - Validation options
   * @returns {RequestHandler} Express request handler middleware
   * @throws {ValidationError} If validation fails, with detailed error information
   * @throws {AppError} For generic errors during validation
   * @description
   * Creates an Express middleware that validates incoming request data against a Zod schema,
   * attaches validated data to the request object, and handles validation errors consistently.
   */
  public validate = (
    schema: ZodSchema<any>,
    source: RequestSource,
    options: IValidationOptions = {}
  ): RequestHandler => {
    // Merge default options with user-provided options
    const mergedOptions = { ...this.DEFAULT_VALIDATION_OPTIONS, ...options }

    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Ensure the source object exists in the request
        if (!req[source]) req[source] = {}

        // Validate data
        const validatedData = await validateZodSchema(schema, req[source], mergedOptions)

        // Attach validated data to the request if specified
        if (mergedOptions.attachValidated) {
          if (!req.validated) req.validated = {}
          req.validated[source] = validatedData
        }

        // Log successful validation if enabled
        if (mergedOptions.logErrors) {
          this.loggerService.debug({
            message: 'Validation Successful',
            context: {
              module: 'ValidationMiddleware',
              method: req.method,
              route: req.originalUrl,
              action: 'VALIDATE'
            },
            requestId: req.request_id || req.headers['x-request-id']?.toString() || 'unknown'
          })
        }

        return next()
      } catch (error) {
        if (error instanceof ZodError) {
          // Format and handle validation errors
          const formattedError = this.formatZodError(error, source, req)

          if (mergedOptions.logErrors) {
            this.loggerService.warn({
              message: formattedError.message,
              context: {
                module: 'ValidationMiddleware',
                method: req.method,
                route: req.originalUrl,
                action: 'VALIDATE',
              },
              requestId: req.request_id || req.headers['x-request-id']?.toString() || 'unknown',
              metadata: {
                errors: Object.values(formattedError.errors).map((err: IValidationErrorDetail) => ({
                  message: err.message,
                  path: err.path,
                  code: err.code,
                  severity: err.severity,
                  suggestions: err.suggestions,
                })),
                summary: formattedError.summary,
                inputDataKeys: req[source] ? Object.keys(req[source]) : [],
              },
            })
          }

          const validationError = new ValidationError({
            message: formattedError.message,
            translationKey: TRANSLATION_KEYS.VALIDATION_ERROR,
            errors: formattedError.errors,
            code: RESPONSE_CODES.VALIDATION_ERROR.code,
            metadata: {
              summary: formattedError.summary,
              source
            },
            requestId: req.request_id || req.headers['x-request-id']?.toString() || 'unknown',
          })

          return next(validationError)
        }

        // Handle generic errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown validation error'
        const genericError = new AppError({
          message: errorMessage,
          translationKey: TRANSLATION_KEYS.BAD_REQUEST,
          statusCode: HTTP_STATUS.BAD_REQUEST,
          code: RESPONSE_CODES.BAD_REQUEST.code,
          requestId: req.request_id || req.headers['x-request-id']?.toString() || 'unknown',
        })

        return next(genericError)
      }
    }
  }

  /**
   * Middleware to validate multiple sources of request data against Zod schemas
   * 
   * @public
   * @param {Partial<Record<RequestSource, ZodSchema<any>>>} schemas - Object mapping sources to Zod schemas
   * @param {IValidationOptions} [options={}] - Validation options
   * @returns {RequestHandler} Express request handler middleware
   * @throws {ValidationError} If validation fails for any source
   * @throws {AppError} For generic errors during validation
   * @description
   * Creates an Express middleware that validates multiple parts of a request
   * (e.g., body, query, params) against different schemas in a single middleware.
   */
  public validateMultiple = (
    schemas: Partial<Record<RequestSource, ZodSchema<any>>>,
    options: IValidationOptions = {}
  ): RequestHandler => {
    const mergedOptions = { ...this.DEFAULT_VALIDATION_OPTIONS, ...options }

    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.validated && mergedOptions.attachValidated) {
          req.validated = {}
        }

        for (const [source, schema] of Object.entries(schemas) as [RequestSource, ZodSchema<any>][]) {
          if (!req[source]) req[source] = {}
          const validatedData = await validateZodSchema(schema, req[source], mergedOptions)

          if (mergedOptions.attachValidated) {
            req.validated[source] = validatedData
          }
        }

        if (mergedOptions.logErrors) {
          this.loggerService.debug({
            message: 'Multiple Sources Validation Successful',
            context: {
              module: 'ValidationMiddleware',
              method: req.method,
              route: req.originalUrl,
              action: 'VALIDATE_MULTIPLE',
            },
            requestId: req.request_id || req.headers['x-request-id']?.toString() || 'unknown',
          })
        }

        return next()
      } catch (error) {
        if (error instanceof ZodError) {
          let source: RequestSource = 'body'
          if (error.errors.length > 0) {
            const firstErrorPath = error.errors[0].path
            const possibleSource = firstErrorPath[0] as RequestSource
            if (Object.keys(schemas).includes(possibleSource)) {
              source = possibleSource
            }
          }

          const formattedError = this.formatZodError(error, source, req, req[source])

          if (mergedOptions.logErrors) {
            this.loggerService.warn({
              message: formattedError.message,
              context: {
                module: 'ValidationMiddleware',
                method: req.method,
                route: req.originalUrl,
                action: 'VALIDATE_MULTIPLE',
              },
              requestId: req.request_id || req.headers['x-request-id']?.toString() || 'unknown',
              metadata: {
                errors: Object.values(formattedError.errors).map((err: IValidationErrorDetail) => ({
                  message: err.message,
                  path: err.path,
                  code: err.code,
                  severity: err.severity,
                  suggestions: err.suggestions,
                })),
                summary: formattedError.summary,
                sources: Object.keys(schemas),
              },
            })
          }

          const validationError = new ValidationError({
            message: formattedError.message,
            translationKey: TRANSLATION_KEYS.VALIDATION_ERROR,
            errors: formattedError.errors,
            code: RESPONSE_CODES.VALIDATION_ERROR.code,
            metadata: {
              summary: formattedError.summary,
              sources: Object.keys(schemas),
            },
            requestId: req.request_id,
          })

          return next(validationError)
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown validation error'
        const genericError = new AppError({
          message: errorMessage,
          translationKey: TRANSLATION_KEYS.BAD_REQUEST,
          statusCode: HTTP_STATUS.BAD_REQUEST,
          code: RESPONSE_CODES.BAD_REQUEST.code,
          requestId: req.request_id,
        })

        return next(genericError)
      }
    }
  }
}

// Example Usage
// import express from 'express'
// import { Container } from 'inversify'
// import { DIContainer } from '~/core/providers'
// import { I18nService, initializeI18n } from '~/infrastructure/i18n'
// import { WinstonLoggerService } from '~/infrastructure/loggers'
// import { z } from 'zod'
// import i18nMiddleware from 'i18next-http-middleware'
// import { ErrorHandlerMiddleware } from '~/common/middlewares/error.middleware'

// const runValidationExample = async () => {
//   const PORT = 3003
//   const app = express()

//   const container = DIContainer.getInstance()
//   const bindModules = (container: Container) => {
//     container.bind(DI_TYPES.IValidationMiddleware).to(ValidationMiddleware)
//     container.bind(DI_TYPES.IWinstonLoggerService).to(WinstonLoggerService)
//     container.bind(DI_TYPES.II18nService).to(I18nService)
//     container.bind(DI_TYPES.IErrorHandlerMiddleware).to(ErrorHandlerMiddleware)
//   }
//   container.registerModule(bindModules)

//   const i18nInstance = await initializeI18n()
//   container.initialize()

//   const i18nService = container.getContainer().get<I18nService>(DI_TYPES.II18nService)
//   app.use(i18nMiddleware.handle(i18nInstance))

//   app.use(express.json())
//   app.use(express.urlencoded({ extended: true }))

//   app.use((req: Request, res: Response, next: NextFunction) => {
//     req.request_id = `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
//     next()
//   })

//   const validationMiddleware = container.getContainer().get<ValidationMiddleware>(DI_TYPES.IValidationMiddleware)

//   const userSchema = z.object({
//     email: z.string().email(),
//     password: z.string().min(8),
//     username: z.string().min(3)
//   })

//   app.post(
//     '/users/register',
//     validationMiddleware.validate(userSchema, 'body'),
//     (req: Request, res: Response) => {
//       res.json({
//         message: 'Validation passed',
//         validatedData: req.validated.body
//       })
//     }
//   )

//   const idSchema = z.object({
//     id: z.string().uuid()
//   })

//   app.get(
//     '/users/:id',
//     validationMiddleware.validate(idSchema, 'params'),
//     (req: Request, res: Response) => {
//       res.json({
//         message: 'User ID validated',
//         validatedId: req.validated.params.id
//       })
//     }
//   )

//   const querySchema = z.object({
//     page: z.number().int().min(1).default(1),
//     limit: z.number().int().min(100).max(10).default(10)
//   })

//   app.get(
//     '/posts',
//     validationMiddleware.validate(querySchema, 'query'),
//     (req: Request, res: Response) => {
//       res.json({
//         message: 'Query parameters validated',
//         validatedQuery: req.validated.query
//       })
//     }
//   )

//   const multipleSchemas = {
//     body: z.object({
//       title: z.string().min(5),
//       content: z.string().min(10)
//     }),
//     query: z.object({
//       category: z.string().optional()
//     })
//   }

//   app.post(
//     '/posts',
//     validationMiddleware.validateMultiple(multipleSchemas),
//     (req: Request, res: Response) => {
//       res.json({
//         message: 'Multiple sources validated',
//         validatedData: req.validated
//       })
//     }
//   )

//   app.post(
//     '/users/custom',
//     validationMiddleware.validate(userSchema, 'body', { abortEarly: true, logErrors: false }),
//     (req: Request, res: Response) => {
//       res.json({
//         message: 'Validation with custom options',
//         validatedData: req.validated.body
//       })
//     }
//   )

//   const errorHandler = container.getContainer().get<ErrorHandlerMiddleware>(DI_TYPES.IErrorHandlerMiddleware)
//   app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//     errorHandler.handleError(err, req, res, next)
//   })

//   app.listen(PORT, () => {
//     console.log(`Validation test server running on port ${PORT}`)
//     console.log(`Test validation scenarios:`)
//     console.log(`- POST /users/register (body validation): http://localhost:${PORT}/users/register`)
//     console.log(`  Try: curl -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"secure123","username":"john"}' http://localhost:${PORT}/users/register`)
//     console.log(`- GET /users/:id (params validation): http://localhost:${PORT}/users/123e4567-e89b-12d3-a456-426614174000`)
//     console.log(`- GET /posts (query validation): http://localhost:${PORT}/posts?page=1&limit=10`)
//     console.log(`- POST /posts (multiple sources): http://localhost:${PORT}/posts?category=tech -d '{"title":"New Post","content":"This is a test post"}'`)
//     console.log(`- POST /users/custom (custom options): http://localhost:${PORT}/users/custom`)
//   })
// }

// runValidationExample()
