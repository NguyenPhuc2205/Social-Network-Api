/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-22 12:05:01
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-27 23:43:37
 * @FilePath      : /server/src/shared/interfaces/zod-validator.interface.ts
 * @Description   : Zod validation error interface and options
 */
import { ErrorSeverity, RequestSource } from '~/shared/types/zod-validator.type'

/**
 * Represents detailed validation error information for a specific field.
 * 
 * @interface IValidationErrorDetail
 * @property {string} message - Human-readable error message explaining the validation failure
 * @property {string} translationKey - Key for message localization/internationalization
 * @property {(string | number)[]} path - Path to the field that failed validation (e.g., ['user', 'email'])
 * @property {string} code - Error code representing the type of validation failure
 * @property {RequestSource} location - Source of the request data (e.g., 'body', 'query', 'params')
 * @property {string} type - Type of validation error
 * @property {Record<string, any>} [details] - Optional additional details about the validation error
 * @property {ErrorSeverity} severity - Severity level of the validation error (e.g., 'error', 'warning', 'info')
 * @property {string[]} suggestions - List of possible fixes or recommendations to resolve the validation error
 */
export interface IValidationErrorDetail {
  message: string
  translationKey: string
  path: (string | number)[]
  code: string
  location: RequestSource
  type: string
  details?: Record<string, any>
  severity: ErrorSeverity
  suggestions: string[]
}

/**
 * Represents a formatted validation error response structure.
 * 
 * @interface IFormattedValidationError
 * @property {string} message - Overall validation error message
 * @property {Record<string, IValidationErrorDetail>} errors - Map of field paths to their detailed error information
 * @property {Record<string, any>} summary - Summarized information about validation errors, may include counts or categorizations
 */
export interface IFormattedValidationError {
  message: string
  errors: Record<string, IValidationErrorDetail>
  summary: Record<string, any>
}

/**
 * Configuration options for customizing validation behavior.
 * 
 * @interface IValidationOptions
 * @property {boolean} [abortEarly=false] - Whether to stop validation on the first error
 * @property {boolean} [attachValidated=true] - Whether to attach validated data to request.validated
 * @property {boolean} [formatErrors=true] - Whether to format errors with detailed information
 * @property {string} [errorMessage='Validation Error'] - Custom error message to return
 * @property {number} [errorStatusCode=422] - HTTP status code to use for validation errors
 * @property {boolean} [logErrors=false] - Whether to log validation errors to the console or log system
 */
export interface IValidationOptions {
  /**
   * Whether to stop validation on the first error encountered.
   * 
   * @default false
   * @type {boolean}
   */
  abortEarly?: boolean

  /**
   * Whether to attach validated and transformed data to request.validated.
   * 
   * @default true
   * @type {boolean}
   */
  attachValidated?: boolean

  /**
   * Whether to format validation errors with detailed field information.
   * 
   * @default true
   * @type {boolean}
   */
  formatErrors?: boolean

  /**
   * Custom error message to return in the response.
   * 
   * @default 'Validation Error'
   * @type {string}
   */
  errorMessage?: string

  /**
   * HTTP status code to use for validation error responses.
   * 
   * @default 422
   * @type {number}
   */
  errorStatusCode?: number

  /**
   * Whether to log validation errors to the console or log system.
   * 
   * @default false
   * @type {boolean}
   */
  logErrors?: boolean
}
