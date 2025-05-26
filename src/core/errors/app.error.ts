/*
 * @Author: Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date: 2025-05-03 20:53:32
 * @LastEditors: Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime: 2025-05-14 12:30:20
 * @FilePath: /server/src/common/errors/app.error.ts
 * @Description: Base error class for all application errors
 */

import { injectable } from 'inversify'
import { TranslationKeys } from '~/shared/types'

/**
 * Interface defining the options for creating an application error
 * 
 * @interface IErrorOptions
 * @description Standardized structure for all error options throughout the application
 */
export interface IErrorOptions {
  translationKey: TranslationKeys // Intermediary key for localization
  message: string // Human-readable error message
  statusCode: number // HTTP status code associated with this error
  code?: string
  cause?: Error // Original error that caused this error, if applicable
  metadata?: Record<string, any>
  isOperational?: boolean // Flag to indicate if the error is operational (true) or programming (false)
  requestId?: string
}

/**
 * Base Error Class for Application Errors
 * 
 * @class AppError
 * @extends {Error}
 * @description A standardized error class that serves as the base for all custom error types
 * in the application. This class extends the native Error object to provide additional features:
 * 
 * - HTTP status codes for appropriate API responses
 * - Error codes for client-side error handling
 * - Internationalization support via message keys
 * - Metadata for additional context
 * - Request tracking via requestId
 * - Operational flags to distinguish between operational and programming errors
 * - Timestamp for error occurrence tracking
 * - Improved serialization for logging and API responses
 */
@injectable()
export class AppError extends Error {
  /** The translation key for internationalization */
  public readonly translationKey: TranslationKeys
  /** HTTP status code to be returned in the response */
  public readonly statusCode: number
  /** Custom error code for application-specific error handling */
  public readonly code?: string
  /** Additional contextual data about the error */
  public readonly metadata?: Record<string, any>
  /** Whether the error is expected/handled (true) or unexpected/crash (false) */
  public readonly isOperational: boolean
  /** ISO timestamp when the error occurred */
  public readonly timestamp: string
  /** Unique identifier for the request to trace errors across logs */
  public readonly requestId?: string

    /**
   * Creates a new AppError instance
   * 
   * @constructor
   * @param {IErrorOptions} options - Error configuration options
   */
  constructor(options: IErrorOptions) {
    super(options.message)
    this.name = this.constructor.name
    this.translationKey = options.translationKey
    this.statusCode = options.statusCode
    this.code = options.code
    this.metadata = options.metadata
    this.isOperational = options.isOperational ?? true  // Fallback to true
    this.timestamp = new Date().toISOString() // Capture the current timestamp
    this.requestId = options.requestId
    if (options.cause) {
      this.cause = options.cause
    }

    // Capture the stack trace for debugging
    Error.captureStackTrace(this, this.constructor)
  }

  /**
   * Returns a plain object representation of the error for serialization
   * 
   * @returns {object} A serializable object containing the error properties
   * @description Provides a consistent JSON representation of error objects for logging and API responses
   */
  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      translationKey: this.translationKey,
      statusCode: this.statusCode,
      code: this.code,
      metadata: this.metadata,
      isOperational: this.isOperational,
      timestamp: this.timestamp,
      requestId: this.requestId,
    }
  }
}
