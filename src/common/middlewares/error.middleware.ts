/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-10 20:51:14
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
import { HTTP_STATUS } from '~/shared/constants'
import { MESSAGES } from '~/shared/types'

@injectable()
export class ErrorHandlerMiddleware {
  constructor(
    @inject(DI_TYPES.IWinstonLoggerService) private logger: IWinstonLoggerService,
    @inject(DI_TYPES.II18nService) private i18nService: II18nService
  ) {}

  public handleError (error: any, req: Request, res: Response, next: NextFunction): void {
    // Log the error
    this.logError(error, req)
    
    // Handle the error
    if (error instanceof AppError) {
      let translatedMessage: string
      try {
        translatedMessage = error.messageKey
          ? this.i18nService.translate(error.messageKey, req, error.metadata)
          : error.message
      } catch (err) {
        translatedMessage = (err as Error).message || 'Translation error occurred'

        this.logger.warn({
          message: `Error translating message`,
          context: {
            module: 'ErrorHandlerMiddleware',
            method: req.method,
            route: req.originalUrl,
            action: 'TRANSLATE_ERROR'
          },
          requestId: req.request_id || req.headers['x-request-id'] as string || 'unknown',
          metadata: error
        }) 
      }

      res.status(error.statusCode).json(
        ApiResponse.error({
          message: translatedMessage,
          messageKey: error.messageKey,
          statusCode: error.statusCode,
          code: error.code,
          metadata: error.metadata,
          errors: error instanceof ValidationError ? error.errors : undefined,
          timestamp: error.timestamp,
          requestId: req.request_id || req.headers['x-request-id'] as string || 'unknown',
        })
      )

      return
    }

    let translatedMessage: string
    try {
      translatedMessage = this.i18nService.translate(
        MESSAGES.INTERNAL_SERVER_ERROR, 
        req
      )
    } catch (err) {
      translatedMessage = 'Internal server error'
      this.logger.warn({
        message: `Translation failed for INTERNAL_SERVER_ERROR`,
        context: { module: 'ErrorHandlerMiddleware', method: req.method, route: req.originalUrl, action: 'TRANSLATE' },
        requestId: req.request_id || req.headers['x-request-id']?.toString() || 'unknown',
        metadata: { error: err },
      })
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      ApiResponse.error({
        message: translatedMessage,
        messageKey: MESSAGES.INTERNAL_SERVER_ERROR,
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        requestId: req.request_id || req.headers['x-request-id']?.toString() || 'unknown',
      })
    )
  }

  public logError (error: any, req: Request) {
    const moduleName: string = 'ErrorHandlerMiddleware'
    const logAction: string = 'HANDLE_ERROR'
    const requestId: string = req.request_id || req.headers['x-request-id']?.toString() || 'unknown'
    const logContext: ILogContext = {
      module: moduleName,
      method: req.method,
      route: req.originalUrl,
      action: logAction
    }

    if (error instanceof AppError && error.isOperational) {
      this.logger.warn({
        message: `Operational error occurred: ${error.message}`,
        context: logContext,
        requestId,
        metadata: {
          statusCode: error.statusCode,
          code: error.code,
          metadata: error.metadata,
          timeStamp: error.timestamp,
          errors: error instanceof ValidationError ? error.errors : undefined,
        }
      })
    } else {
      this.logger.error({
        message: `Unexpected error occurred: ${error.message}`,
        context: logContext,
        requestId,
        metadata: {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          code: MESSAGES.INTERNAL_SERVER_ERROR,
          metadata: error.metadata,
          timeStamp: error.timestamp,
        },
        error: error
      })
    }
  }
}

// Example usage
// import express from 'express'
// import cookieParser from 'cookie-parser'
// import i18nMiddleware from 'i18next-http-middleware'
// import { initializeI18n } from '~/infrastructure/i18n'
// import { createDIContainer } from '~/core/providers'
// const runErrorTestServer = async () => {
//   const app = express()
//   const container = createDIContainer()
//   const i18nInstance = await initializeI18n()

//   app.use(cookieParser())
//   app.use(i18nMiddleware.handle(i18nInstance))
//   app.use(express.json())

//   // Route with native error
//   app.get('/error', (req, res) => {
//     throw new Error('This is a test error')
//   })

//   // Route with AppError
//   app.get('/custom-error', (req, res, next) => {
//     const error = new AppError({
//       message: 'This is a custom error',
//       statusCode: 400,
//       messageKey: MESSAGES.VALIDATION_ERROR,
//       code: 'BAD_REQUEST',
//       metadata: { field: 'email' }
//     })
//     next(error)
//   })

//   // Use custom error handler
//   const errorHandler = container.get<ErrorHandlerMiddleware>(DI_TYPES.ErrorHandlerMiddleware)
//   app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//     errorHandler.handleError(err, req, res, next)
//   })

//   const PORT = 3001
//   app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`)
//     console.log(`Test native error: http://localhost:${PORT}/error`)
//     console.log(`Test custom AppError: http://localhost:${PORT}/custom-error`)
//   })
// }

// runErrorTestServer()
