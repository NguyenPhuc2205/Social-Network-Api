/*
 * @Author       : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date         : 2025-02-12 16:52:32
 * @LastEditors  : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime : 2025-05-03 16:25:56
 * @FilePath     : /server/src/core/response/api.response.ts
 * @Description  : API response class for standardizing API responses
 */

import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { IApiResponseMetadata, IApiErrorDetails, IApiResponseOptions } from '~/core/response/api.response.interface'
import { MessageKeys, MESSAGES } from '~/shared/types'
import { injectable } from 'inversify'

/**
 * Standard API response class
 * @class ApiResponse
 * @description A standardized response format for all API endpoints that ensures
 * consistent error handling, success responses, and metadata across the application.
 * Supports both success and error states with appropriate data structures.
 * @template T - Type of data returned in the response
 */

@injectable()
export class ApiResponse<T> {
  public readonly status: 'success' | 'error'
  public readonly messageKey: MessageKeys
  public readonly message: string
  public readonly data?: T
  public readonly code?: string
  public readonly statusCode?: number
  public readonly metadata?: IApiResponseMetadata
  public readonly errors?: Record<string, IApiErrorDetails>
  public readonly requestId?: string
  public readonly timestamp?: string

  /**
   * Creates a new API response
   * @constructor
   * @param {IApiResponseOptions<T>} options - Response options
   */
  constructor(options: IApiResponseOptions<T>) {
    this.status = options.status
    this.messageKey = options.messageKey
    this.message = options.message
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
   * @param {Partial<IApiResponseOptions<T>> & { messageKey: MessageKeys, message: string }} options - Success response options
   * @param {MessageKeys} options.messageKey - Message key for localization (required)
   * @param {string} options.message - Success message (required)
   * @param {T} [options.data] - Response data
   * @param {string} [options.code] - Success code
   * @param {number} [options.statusCode] - HTTP status code
   * @param {IApiResponseMetadata} [options.metadata] - Additional metadata
   * @param {string} [options.requestId] - Request ID for tracing
   * @returns {ApiResponse<T>} Success API response
   */
  public static success<T>(options: Partial<IApiResponseOptions<T>> & { messageKey: MessageKeys, message: string }): ApiResponse<T> {
    return new ApiResponse<T>({
      status: 'success',
      messageKey: options.messageKey || MESSAGES.SUCCESS,
      message: options.message,
      data: options.data,
      code: options.code || RESPONSE_CODES.SUCCESS.code,
      statusCode: options.statusCode || RESPONSE_CODES.SUCCESS.defaultStatus || HTTP_STATUS.OK,
      metadata: options.metadata,
      requestId: options.requestId,
    })    
  }

  /**
   * Creates an error response
   * @static
   * @template T - Type of data returned in the response
   * @param {Partial<IApiResponseOptions<T>> & { messageKey: MessageKeys, message: string }} options - Error response options
   * @param {MessageKeys} options.messageKey - Message key for localization (required)
   * @param {string} options.message - Error message (required)
   * @param {string} [options.code] - Error code
   * @param {number} [options.statusCode] - HTTP status code
   * @param {Record<string, IApiErrorDetails>} [options.errors] - Structured validation/error details keyed by field name
   * @param {IApiResponseMetadata} [options.metadata] - Additional metadata
   * @param {string} [options.requestId] - Request ID for tracing
   * @returns {ApiResponse<T>} Error API response
   */
  public static error<T>(options: Partial<IApiResponseOptions<T>> & { messageKey: MessageKeys, message: string }): ApiResponse<T> {
    return new ApiResponse<T>({
      status: 'error',
      messageKey: options.messageKey || MESSAGES.UNKNOWN_ERROR,
      message: options.message,
      code: options.code || RESPONSE_CODES.INTERNAL_SERVER_ERROR.code,
      statusCode: options.statusCode || RESPONSE_CODES.INTERNAL_SERVER_ERROR.defaultStatus || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errors: options.errors,
      metadata: options.metadata,
      requestId: options.requestId,
    })
  }

  /**
   * Converts the response to a plain object
   * @returns {object} Plain object representation of the response
   */
  public toJSON() {
    return {
      status: this.status,  // 'success' or 'error'
      message: this.message,
      messageKey: this.messageKey,  // Key for localization
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

// Usage Example
// import express, { Request, Response, NextFunction } from 'express'
// import { Container } from 'inversify'

// // Setup a minimal test server
// const setupTestServer = () => {
//   const container = new Container()
  
//   class MockApiResponseService implements IApiResponseService {
//     resolveMessage(options: any): string {
//       return options.message || options.defaultMessage || 'Message';
//     }
//   }
  
//   container.bind<IApiResponseService>(DI_TYPES.IApiResponseService).to(MockApiResponseService)
  
//   const apiResponseService = container.get<IApiResponseService>(DI_TYPES.IApiResponseService)
  
//   const app = express()
//   app.use(express.json())
  
//   // Example endpoint with success response
//   app.get('/api/success', (req: Request, res: Response, next: NextFunction) => {
//     const response = ApiResponse.success({
//       messageKey: MESSAGES.SUCCESS,
//       message: 'Successfully retrieved data',
//       data: {
//         version: '1.0.0',
//         serverTime: new Date().toISOString(),
//         features: ['Authentication', 'User Management', 'Products']
//       },
//       metadata: {
//         totalItems: 3,
//         page: 1,
//         itemsPerPage: 10
//       },
//     })
    
//     res.status(response.statusCode || 200).json(response.toJSON())
//   })
  
//   // Example endpoint with error response
//   app.get('/api/error', (req: Request, res: Response) => {
//     const response = ApiResponse.error({
//       messageKey: MESSAGES.VALIDATION_ERROR,
//       message: 'Validation failed for input data',
//       errors: {
//         username: { 
//           message: 'Username must be between 3-20 characters',
//           code: 'INVALID_LENGTH',
//           value: req.query.username || ''
//         },
//         email: {
//           message: 'Invalid email format',
//           code: 'INVALID_FORMAT',
//           value: req.query.email || ''
//         }
//       },
//       statusCode: HTTP_STATUS.BAD_REQUEST
//     })
    
//     res.status(response.statusCode || 400).json(response.toJSON())
//   })
  
//   // Start the server
//   const PORT = 3001
//   app.listen(PORT, () => {
//     console.log(`Test server running on http://localhost:${PORT}`)
//     console.log(`- Success example: http://localhost:${PORT}/api/success`)
//     console.log(`- Error example: http://localhost:${PORT}/api/error`)
//   })
// }

// setupTestServer()
