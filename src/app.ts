/*
 * @Author       : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date         : 2025-02-12 16:52:32
 * @LastEditors  : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime : 2025-04-29 17:20:06
 * @FilePath     : \server\src\app.ts
 * @Description  : App configuration and initialization
 */

import express, { Application, NextFunction, Request, response, Response } from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import morgan, { token, TokenIndexer } from 'morgan'
import { v4 as uuidv4 } from 'uuid'
import { Container, injectable } from 'inversify'
import { IWinstonLoggerService } from '~/infrastructure/loggers/winston.interface'
import cookieParser from 'cookie-parser'
import { DI_TYPES } from '~/core/providers'
import { ErrorHandlerMiddleware, I18nMiddleware, LanguageDetectionMiddleware } from '~/common/middlewares'
import { AppError } from '~/core/errors'
import { HTTP_STATUS, RESPONSE_CODES } from '~/shared/constants'
import { TRANSLATION_KEYS } from '~/shared/types'
import { IDatabaseConnection } from '~/infrastructure/database'
import { IAppConfig } from '~/configs'

@injectable()
export class App {
  public app: Application
  private container: Container
  private logger: IWinstonLoggerService

  constructor(container: Container, logger: IWinstonLoggerService) {
    this.app = express()
    this.container = container
    this.logger = logger
  }

  public async initialize(): Promise<void> {
    this.setupMiddlewares(this.app)
    this.setupRoutes(this.app)
    this.setupErrorHandling(this.app)
  }

  private setupMiddlewares = (app: Application) => {
    // Security middlewares
    this.setupSecurityMiddlewares(app)

    // Request parsing middlewares
    this.setupParsingMiddlewares(app)

    // Logging middlewares
    this.setupLoggingMiddlewares(app)

    // Performance middlewares
    this.setupPerformanceMiddlewares(app)

    // Language detection and i18n middlewares
    this.setupLanguageMiddleware(app)
  }

  private setupSecurityMiddlewares = (app: Application) => {
    // Middleware for setting security-related HTTP headers
    app.use(helmet())

    // Middleware for enabling Cross-Origin Resource Sharing (CORS)
    app.use(cors())
  }

  private setupParsingMiddlewares = (app: Application) => {
    // Middleware for parsing incoming requests with JSON payloads
    app.use(express.json())

    // Middleware for parsing incoming requests with URL-encoded payloads (x-www-form-urlencoded)
    app.use(express.urlencoded({ extended: true }))

    // Middleware for parsing cookies from incoming requests (Support Language Detection Middleware)
    app.use(cookieParser())
  }

  private setupLoggingMiddlewares = (app: Application) => {
    const skipUrlPaths = ['/health', '/metrics', '/favicon.ico']

    /**
     * Middleware for assigning request ID to each request
     */
    app.use((req: Request, res: Response, next: NextFunction) => {
      req.request_id = (req.headers['x-request-id'] as string) || uuidv4()
      res.setHeader('x-request-id', req.request_id)
      next()
    })

    /**
     * Define custom token with value from the callback
     */
    morgan.token('request-id', (req: Request, res: Response) => req.request_id)
    morgan.token('colored-status', (req: Request, res: Response) => {
      // Customize status color based on status code ranges
      const status = res.statusCode
      const color =
        status >= 500
          ? 31 // red
          : status >= 400
            ? 33 // yellow
            : status >= 300
              ? 36 // cyan
              : status >= 200
                ? 32 // green
                : 0 // no color
      return `\x1b[${color}m${status}\x1b[0m`
    })

    const morganFormat = `:method :url :colored-status :response-time ms - :res[content-length] - :request-id`

    /**
     * Middleware for logging HTTP requests in console <=> morgan('dev')
     */
    app.use(morgan(morganFormat, {}))

    /**
     * Middleware for logging HTTP requests with winston
     */
    app.use((req: Request, res: Response, next: NextFunction) => {
      const startTime = process.hrtime()
      const url = req.originalUrl || req.url

      // Log request details when the request is completed
      res.on('finish', () => {
        const duration = process.hrtime(startTime) // [seconds, nanoseconds]
        const responseTimeMs = duration[0] * 1000 + Math.round(duration[1] / 1e6) // convert to milliseconds

        const responseData = {
          method: req.method,
          url: url,
          status: res.statusCode,
          statusMessage: res.statusMessage,
          responseTime: `${responseTimeMs} ms`,
          contentLength: res.getHeader('content-length'),
          contentType: res.getHeader('content-type')
        }

        const logLevel = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'http'

        // Create log message
        const message = `Response: ${req.method} ${url} ${res.statusCode} ${responseTimeMs}ms`

        // Log using the appropriate level
        this.logger[logLevel](
          message,
          { module: 'HTTP', method: req.method, route: url, action: 'Response' },
          req.request_id,
          responseData
        )
      })

      // Handle errors
      res.on('error', (error) => {
        const hrtime = process.hrtime(startTime)
        const responseTimeMs = (hrtime[0] * 1000 + hrtime[1] / 1000000).toFixed(2)

        this.logger.error(
          `Response Error: ${req.method} ${url}`,
          {
            module: 'HTTP',
            method: req.method,
            route: url
          },
          req.request_id,
          {
            method: req.method,
            url: url,
            status: res.statusCode,
            responseTime: `${responseTimeMs}ms`,
            error: error.message
          },
          error
        )
      })

      next()
    })
  }

  private setupPerformanceMiddlewares = (app: Application) => {
    // Compress response bodies for all requests
    app.use(compression())
  }

  private setupLanguageMiddleware = (app: Application) => {
    const languageDetectionMiddleware = this.container.get<LanguageDetectionMiddleware>(DI_TYPES.ILanguageDetectionMiddleware)
    const i18nMiddleware = this.container.get<I18nMiddleware>(DI_TYPES.II18nMiddleware)
    
    // handle method is callback for express middleware, it will lost `this` context so need to bind.
    app.use(languageDetectionMiddleware.handle.bind(languageDetectionMiddleware))
    app.use(i18nMiddleware.handle.bind(i18nMiddleware))
  }

  private setupRoutes = (app: Application) => {
    app.get('/test-i18n', (req: Request, res: Response) => {
      const greeting = req.t('common:GREETING', { name: 'Phuc' })
      res.json({
        status: 'success',
        message: greeting,
        language: req.language,
      })
    })
    
    // Health check endpoint
    app.get('/health', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const db = this.container.get<IDatabaseConnection>(DI_TYPES.IDatabaseService)
        await db.getDb().command({ ping: 1 })
        
        res.status(200).json({
          status: 'success',
          message: 'Server and database is healthy',
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        next(error)
      }
      
    })

    app.use((req: Request, res: Response, next: NextFunction) => {
      const error = new AppError({
        message: `Cannot ${req.method} ${req.originalUrl}`,
        statusCode: HTTP_STATUS.NOT_FOUND,
        translationKey: TRANSLATION_KEYS.NOT_FOUND,
        code: RESPONSE_CODES.NOT_FOUND.code,
        metadata: { method: req.method, path: req.originalUrl },
      })
      next(error)
    })
  }

  private setupErrorHandling = (app: Application) => {
    const errorHandler = this.container.get<ErrorHandlerMiddleware>(DI_TYPES.IErrorHandlerMiddleware)
    app.use(errorHandler.handleError.bind(errorHandler))
  }

  public listen(): any {
    const appConfig = this.container.get<IAppConfig>(DI_TYPES.IAppConfig)
    const PORT = appConfig.PORT
    return this.app.listen(PORT, () => {
      this.logger.info(`Server is running on http://localhost:${PORT}`)
    })
  }
}
