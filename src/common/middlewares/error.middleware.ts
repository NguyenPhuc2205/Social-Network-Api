/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-24 11:18:35
 * @FilePath      : /server/src/common/middlewares/error.middleware.ts
 * @Description   : Default error handler middleware that handles all errors thrown in the application.
 */

import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { AppError, ValidationError } from '~/core/errors'
import { DI_TYPES } from '~/core/providers'
import { ApiResponse } from '~/core/response/api.response'
import { II18nService } from '~/infrastructure/i18n'
import { ILogContext, IWinstonLoggerService } from '~/infrastructure/loggers'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { TRANSLATION_KEYS } from '~/shared/types'

/**
 * Global error handler middleware for Express applications
 * 
 * @class ErrorHandlerMiddleware
 * @description 
 * Provides centralized error handling for all types of errors in the application.
 * Includes specific handling for AppError types with proper status codes, i18n support,
 * structured logging, and consistent client responses.
 */
@injectable()
export class ErrorHandlerMiddleware {
  /**
   * Creates an instance of the error handler middleware
   * 
   * @constructor
   * @param {IWinstonLoggerService} loggerService - Logger service for recording error information
   * @param {II18nService} i18nService - Internationalization service for error message translation
   */
  constructor(
    @inject(DI_TYPES.IWinstonLoggerService) private loggerService: IWinstonLoggerService,
    @inject(DI_TYPES.II18nService) private i18nService: II18nService
  ) {}

  /**
   * Handles all errors thrown during request processing
   * 
   * @param {any} error - The error to handle
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   * @returns {void}
   * @description 
   * Main error handling method that processes all exceptions, logs them,
   * and returns appropriate responses to the client
   */
  public handleError (error: any, req: Request, res: Response, next: NextFunction): void {
    // Log the error
    this.logError(error, req)
    
    // Extract request ID from request object or headers for tracing
    const requestId = req.request_id || req.headers['x-request-id']?.toString() || 'unknown'

    // Handle application-specific errors (all custom error types)
    if (error instanceof AppError) {
      const response = ApiResponse.error({
        message: error.message,
        translationKey: error.translationKey,
        code: error.code,
        statusCode: error.statusCode,
        requestId,
        metadata: error.metadata,
        errors: error instanceof ValidationError && error.errors ? error.errors : undefined,
      })

      res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response)
      return; // Important: return to prevent executing the generic error handler
    }

    // Handle native/generic errors (not derived from AppError)
    let translatedMessage: string
    try {
      // Attempt to translate the error message using i18n
      translatedMessage = this.i18nService.translate(
        TRANSLATION_KEYS.INTERNAL_SERVER_ERROR, 
        req
      )
    } catch (err) {
      // Fallback message if translation fails
      translatedMessage = 'Internal server error'

      // Log translation failure
      this.loggerService.warn({
        message: `Translation failed for INTERNAL_SERVER_ERROR`,
        context: { 
          module: 'ErrorHandlerMiddleware',
          method: req.method,
          route: req.originalUrl,
          action: 'TRANSLATE'
        },
        requestId,
        metadata: { error: err },
      })
    }

    // Create generic error response
    const response = ApiResponse.error({
      message: translatedMessage,
      translationKey: TRANSLATION_KEYS.INTERNAL_SERVER_ERROR,
      code: RESPONSE_CODES.INTERNAL_SERVER_ERROR.code,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      requestId,
    })
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response)
  }

  /**
   * Logs error details to the application logger
   * 
   * @param {any} error - The error to log
   * @param {Request} req - Express request object
   * @returns {void}
   * @description 
   * Formats and logs error information with appropriate severity level
   * based on the error type. Operational errors are logged as warnings,
   * while unexpected errors are logged as errors.
   */
  public logError (error: any, req: Request): void {
    const moduleName: string = 'ErrorHandlerMiddleware'
    const logAction: string = 'HANDLE_ERROR'
    const requestId: string = req.request_id || req.headers['x-request-id']?.toString() || 'unknown'
    const logContext: ILogContext = {
      module: moduleName,
      method: req.method,
      route: req.originalUrl,
      action: logAction
    }

    // Handle non-object errors
    const errorMessage = typeof error === 'string' || typeof error === 'number'
      ? String(error)
      : error?.message || 'Unknown error'
    const timestamp = error?.timestamp || new Date().toISOString()

    if (error instanceof AppError && error.isOperational) {
      // Log operational errors as warnings
      this.loggerService.warn({
        message: `Operational error occurred: ${error.message}`,
        context: logContext,
        requestId,
        metadata: {
          statusCode: error.statusCode,
          code: error.code,
          metadata: error.metadata,
          timestamp,
          errors: error instanceof ValidationError && error.errors ? error.errors : undefined,
        }
      })
    } else {
      // Log unexpected errors as errors with higher severity
      this.loggerService.error({
        message: `Unexpected error occurred: ${errorMessage}`,
        context: logContext,
        requestId,
        metadata: {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          code: TRANSLATION_KEYS.INTERNAL_SERVER_ERROR,
          metadata: error.metadata,
          timestamp: error.timestamp, // Ensure consistent casing
        },
        error: error instanceof Error ? error : undefined,
      })
    }
  }
}

// Example Usage
// import express from 'express'
// import { Container } from 'inversify'
// import { DIContainer } from '~/core/providers'
// import { I18nService, initializeI18n } from '~/infrastructure/i18n'
// import { WinstonLoggerService } from '~/infrastructure/loggers'
// import { RequestSource } from '~/shared/types'
// import { BadRequestError } from '~/core/errors'

// const runStartMiniServer = async () => {
//   const PORT = 3002
//   const app = express()

//   const container = DIContainer.getInstance()
//   const bindModules = (container: Container) => {
//     container.bind(DI_TYPES.IErrorHandlerMiddleware).to(ErrorHandlerMiddleware)
//     container.bind(DI_TYPES.IWinstonLoggerService).to(WinstonLoggerService)
//     container.bind(DI_TYPES.II18nService).to(I18nService)    
//   }
//   container.registerModule(bindModules)

//   await initializeI18n()
//   container.initialize()

//   app.use(express.json())
//   app.use(express.urlencoded({ extended: true }))

//   // Add request ID middleware for tracking errors
//   app.use((req: Request, res: Response, next: NextFunction) => {
//     req.request_id = `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
//     next()
//   })

//   const i18nService = container.getContainer().get<II18nService>(DI_TYPES.II18nService)

//   // 1. Standard HTTP error handling examples
//   app.get('/bad-request', (req: Request, res: Response, next: NextFunction) => {
//     const error = new AppError({
//       message: i18nService.resolveMessage({
//         translationKey: TRANSLATION_KEYS.BAD_REQUEST,
//         req,
//         defaultMessage: 'Bad request',
//       }),
//       statusCode: HTTP_STATUS.BAD_REQUEST,
//       translationKey: TRANSLATION_KEYS.BAD_REQUEST,
//       code: RESPONSE_CODES.BAD_REQUEST.code,
//       metadata: { 
//         requestParams: req.query,
//         timestamp: new Date().toISOString()
//       }
//     })
//     next(error)
//   })
  
//   // 2. Validation error example
//   app.get('/validation-error', (req: Request, res: Response, next: NextFunction) => {
//     const validationErrors = {
//       username: {
//         message: 'Username must be at least 3 characters',
//         translationKey: TRANSLATION_KEYS.USERNAME_LENGTH,
//         path: ['username'],
//         code: 'MIN_LENGTH',
//         location: 'body' as RequestSource,
//         type: 'field'
//       },
//       email: {
//         message: 'Invalid email format',
//         translationKey: TRANSLATION_KEYS.EMAIL_INVALID,
//         path: ['email'],
//         code: 'INVALID_FORMAT',
//         location: 'body' as RequestSource,
//         type: 'field'
//       }
//     }
    
//     const error = new ValidationError({
//       message: 'Validation failed',
//       translationKey: TRANSLATION_KEYS.VALIDATION_ERROR,
//       errors: validationErrors,
//       metadata: { fields: Object.keys(validationErrors) }
//     })
    
//     next(error)
//   })
  
//   // 3. Async error handling with Promise
//   app.get('/async-error', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await new Promise<void>((_, reject) => {
//         setTimeout(() => reject(new Error('Async operation failed')), 100)
//       })
//       res.json({ success: true })
//     } catch (error) {
//       next(error)
//     }
//   })
  
//   // 4. Database-like error (simulated)
//   app.get('/db-error', (req: Request, res: Response, next: NextFunction) => {
//     const dbError = new Error('Database connection failed')
//     dbError.name = 'MongooseError'
//     next(dbError)
//   })
  
//   // 5. Permission denied error
//   app.get('/forbidden', (req: Request, res: Response, next: NextFunction) => {
//     const error = new AppError({
//       message: 'You do not have permission to access this resource',
//       statusCode: HTTP_STATUS.FORBIDDEN,
//       translationKey: TRANSLATION_KEYS.FORBIDDEN,
//       code: RESPONSE_CODES.FORBIDDEN.code,
//       metadata: { 
//         requiredRole: 'admin',
//         userRole: 'user'
//       }
//     })
//     next(error)
//   })
  
//   // 6. Not found error
//   app.get('/not-found', (req: Request, res: Response, next: NextFunction) => {
//     const error = new AppError({
//       message: 'Resource not found',
//       statusCode: HTTP_STATUS.NOT_FOUND,
//       translationKey: TRANSLATION_KEYS.NOT_FOUND,
//       code: RESPONSE_CODES.NOT_FOUND.code,
//       metadata: { 
//         resourceId: req.query.id || 'unknown'
//       }
//     })
//     next(error)
//   })
  
//   // 7. Simulated server error
//   app.get('/server-error', (req: Request, res: Response, next: NextFunction) => {
//     const error = new AppError({
//       message: 'Internal server error occurred',
//       statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
//       translationKey: TRANSLATION_KEYS.INTERNAL_SERVER_ERROR,
//       code: RESPONSE_CODES.INTERNAL_SERVER_ERROR.code,
//       metadata: { 
//         cause: 'Server configuration issue',
//         timestamp: new Date().toISOString()
//       }
//     })
//     next(error)
//   })
  
//   // 8. Simulated partial error
//   app.get('/partial-error', (req: Request, res: Response, next: NextFunction) => {
//     const badRequestError = new BadRequestError({
//       message: 'Invalid request data',
//       code: 'INVALID_DATA',
//       metadata: {},
//       requestId: req.request_id,
//     })
//   })

//   // Add catch-all 404 route
//   app.use((req: Request, res: Response, next: NextFunction) => {
//     const error = new AppError({
//       message: `Route ${req.method} ${req.originalUrl} not found`,
//       statusCode: HTTP_STATUS.NOT_FOUND,
//       translationKey: TRANSLATION_KEYS.NOT_FOUND,
//       code: RESPONSE_CODES.NOT_FOUND.code,
//       metadata: { 
//         method: req.method,
//         path: req.originalUrl 
//       }
//     })
//     next(error)
//   })
  
//   // Register error handler middleware
//   const errorHandler = container.getContainer().get<ErrorHandlerMiddleware>(DI_TYPES.IErrorHandlerMiddleware)
//   app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//     errorHandler.handleError(err, req, res, next)
//   })

//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`)
//     console.log(`Error handler test server: http://localhost:${PORT}`)
//     console.log(`\nTest different error scenarios:`)
//     console.log(`- Bad Request: http://localhost:${PORT}/bad-request`)
//     console.log(`- Validation Error: http://localhost:${PORT}/validation-error`)
//     console.log(`- Async Error: http://localhost:${PORT}/async-error`)
//     console.log(`- Database Error: http://localhost:${PORT}/db-error`)
//     console.log(`- Forbidden: http://localhost:${PORT}/forbidden`)
//     console.log(`- Not Found: http://localhost:${PORT}/not-found`)
//     console.log(`- Server Error: http://localhost:${PORT}/server-error`)
//     console.log(`- Partial Error: http://localhost:${PORT}/partial-error`)
//     console.log(`- Any other path will trigger a 404 error`)
//   })
// }

// runStartMiniServer()
