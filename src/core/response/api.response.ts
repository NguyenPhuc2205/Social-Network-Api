/*
 * @Author       : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date         : 2025-02-12 16:52:32
 * @LastEditors: Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime: 2025-05-03 16:25:56
 * @FilePath     : /server/src/core/response/api.response.ts
 * @Description  : API response class for standardizing API responses
 */

import { HTTP_STATUS } from '~/shared/constants'
import { MessageKeys, MESSAGES } from '~/shared/types'

/**
 * Interface for API response metadata
 * @interface IApiResponseMetadata
 * @property {number} [page] - Current page number for paginated responses
 * @property {number} [limit] - Number of items per page
 * @property {number} [total] - Total number of items
 * @property {number} [totalPage] - Total number of pages
 */
export interface IApiResponseMetadata {
  page?: number
  limit?: number
  total?: number
  totalPage?: number
  [key: string]: any
}

/**
 * Interface for API error details
 * @interface IApiErrorDetails
 * @property {string} [message] - Error message
 * @property {string} [code] - Error code
 * @property {string} [field] - Field that caused the error
 */
export interface IApiErrorDetails {
  message?: string
  code?: string
  field?: string
  [key: string]: any
}

/**
 * Interface for API response options
 * @interface IApiResponseOptions
 * @template T - Type of data returned in the response
 * @property {'success' | 'error'} status - Response status
 * @property {string} [message] - Human-readable message
 * @property {MessageKeys} [messageKey] - Key for localization
 * @property {T} [data] - Response data
 * @property {string} [code] - Custom code for the response
 * @property {number} [statusCode] - HTTP status code
 * @property {IApiResponseMetadata} [metadata] - Additional metadata
 * @property {IApiErrorDetails[]} [errors] - Array of error details
 * @property {string} [requestId] - Unique identifier for tracing
 * @property {string} [timestamp] - ISO timestamp
 */
export interface IApiResponseOptions<T> {
  status: 'success' | 'error'
  message?: string
  messageKey?: MessageKeys
  data?: T
  code?: string
  statusCode?: number
  metadata?: IApiResponseMetadata
  errors?: IApiErrorDetails[] 
  requestId?: string
  timestamp?: string
}

/**
 * Standard API response class
 * @class ApiResponse
 * @template T - Type of data returned in the response
 */
export class ApiResponse<T> {
  public readonly status: 'success' | 'error'
  public readonly message?: string
  public readonly messageKey?: MessageKeys
  public readonly data?: T
  public readonly code?: string
  public readonly statusCode: number
  public readonly metadata?: IApiResponseMetadata
  public readonly errors?: IApiErrorDetails[]
  public readonly requestId?: string
  public readonly timestamp: string

  /**
   * Creates a new API response
   * @constructor
   * @param {IApiResponseOptions<T>} options - Response options
   */
  constructor(options: IApiResponseOptions<T>) {
    this.status = options.status
    this.message = options.message
    this.messageKey = options.messageKey
    this.data = options.data
    this.code = options.code
    this.statusCode = options.statusCode || (options.status === 'success' ? HTTP_STATUS.OK : HTTP_STATUS.BAD_REQUEST)
    this.metadata = options.metadata
    this.errors = options.errors
    this.requestId = options.requestId
    this.timestamp = options.timestamp || new Date().toISOString()
  }

  /**
   * Creates a success response
   * @static
   * @template T - Type of data returned in the response
   * @param {Partial<IApiResponseOptions<T>>} options - Success response options
   * @param {T} [options.data] - Response data
   * @param {string} [options.message] - Success message
   * @param {MessageKeys} [options.messageKey=MESSAGES.SUCCESS] - Message key for localization
   * @param {string} [options.code] - Success code
   * @param {number} [options.statusCode=HTTP_STATUS.OK] - HTTP status code
   * @param {IApiResponseMetadata} [options.metadata] - Additional metadata
   * @param {string} [options.requestId] - Request ID for tracing
   * @returns {ApiResponse<T>} Success API response
   */
  public static success<T>({
    data,
    message,
    messageKey = MESSAGES.SUCCESS,
    code,
    statusCode = HTTP_STATUS.OK,
    metadata,
    requestId,
  }: Partial<IApiResponseOptions<T>>): ApiResponse<T> {
    return new ApiResponse<T>({
      status: 'success',
      message,
      messageKey,
      data,
      code,
      statusCode,
      metadata,
      requestId
    })    
  }

  /**
   * Creates an error response
   * @static
   * @template T - Type of data returned in the response
   * @param {Partial<IApiResponseOptions<T>>} options - Error response options
   * @param {string} [options.message] - Error message
   * @param {MessageKeys} [options.messageKey=MESSAGES.UNKNOWN_ERROR] - Message key for localization
   * @param {string} [options.code] - Error code
   * @param {number} [options.statusCode=HTTP_STATUS.INTERNAL_SERVER_ERROR] - HTTP status code
   * @param {IApiErrorDetails[]} [options.errors] - Detailed error information
   * @param {IApiResponseMetadata} [options.metadata] - Additional metadata
   * @param {string} [options.requestId] - Request ID for tracing
   * @returns {ApiResponse<T>} Error API response
   */
  public static error<T>({
    message,
    messageKey = MESSAGES.UNKNOWN_ERROR,
    code,
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errors,
    metadata,
    requestId,
  }: Partial<IApiResponseOptions<T>>): ApiResponse<T> {
    return new ApiResponse<T>({
      status: 'error',
      message,
      messageKey,
      code,
      statusCode,
      errors,
      metadata,
      requestId,
    })
  }

  /**
   * Converts the response to a plain object
   * @returns {object} Plain object representation of the response
   */
  public toJSON() {
    return {
      status: this.status,
      message: this.message,
      messageKey: this.messageKey,
      data: this.data,
      code: this.code,
      statusCode: this.statusCode,
      metadata: this.metadata,
      errors: this.errors,
      requestId: this.requestId,
      timestamp: this.timestamp,
    }
  }
}

// Usage Examples
// const successExample = () => {
//   const userData = { id: 1, name: 'Nguyen Phuc', email: 'puckluvperfumee@example.com' }
//   return ApiResponse.success({
//     data: userData,
//     message: 'User retrieved successfully'
//   })
// }
// console.log(successExample1().toJSON())
// console.log(JSON.stringify(successExample1()))

// const errorExample = () => {
//   return ApiResponse.error({
//     message: 'Validation failed',
//     statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
//     errors: [
//       { field: 'email', message: 'Email is invalid', code: 'INVALID_EMAIL' },
//       { field: 'password', message: 'Password must be at least 8 characters', code: 'PASSWORD_TOO_SHORT' }
//     ]
//   })
// }
// console.log(errorExample().toJSON())
// console.log(JSON.stringify(errorExample()))
