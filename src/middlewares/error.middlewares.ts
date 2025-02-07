import { omit } from 'lodash'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { Request, Response, NextFunction } from 'express'
import { logger } from '~/loggers/winston.log'

/**
 * Global error handler middleware
 * Catch all err thrown during request processing
 * Handle 2 type error
 * 1. ErrorWithStatus: Custom error with defined status code
 * 2. Other errors: Treated as internal server errs (500)
 *
 * @param err - Error object thrown during request processing
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction
 * @returns Response with appropriate status code and error details
 */
export const defaultErrorsHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Handle ErrorWithStatus
  if (err instanceof ErrorWithStatus) {
    // Remove status from response and send remaining error info
    logger.error(`${err.status} - ${err.message}`)
    return res.status(err.status).json(omit(err, ['status']))
  }
  // Make all error properties enumerable for proper error reporting.
  // This allows properties to be visible in JSON.stringify and Object.keys
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })

  // Handle unknown errors as Internal Server Errors
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfo: omit(err, ['stack'])
  })
}
