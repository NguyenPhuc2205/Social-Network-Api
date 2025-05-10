/*
 * @Author       : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date         : 2025-02-12 16:52:32
 * @LastEditors: Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime: 2025-05-03 09:15:22
 * @FilePath     : \server\src\infrastructure\loggers\winston.log.ts
 * @Description  : Create a logger using Winston with daily rotation and custom formatting
 */

import fs from 'fs'
import path from 'path'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { ILogContext, ILogParams, IWinstonLoggerService } from '~/infrastructure/loggers/winston.interface'
import { v4 as uuidv4 } from 'uuid'

const { createLogger, format, transports } = winston
const { combine, timestamp, splat, colorize, uncolorize, printf, align, label, errors } = format

/**
 * Winston implementation of the logger service
 * @class WinstonLoggerService
 * @implements {IWinstonLoggerService}
 * @description Provides structured logging capabilities with Winston transport
 */
export class WinstonLoggerService implements IWinstonLoggerService {
  private static instance: IWinstonLoggerService | null = null
  private logger: winston.Logger
  private readonly logDir: string = path.resolve('logs')
  private logLevel: string = 'debug'

  /**
   * Creates a new Winston logger instance
   * @constructor
   */
  constructor() {
    this.ensureLogDirectoryExists()
    this.logger = this.createLogger()
  }

  /**
   * Gets the singleton instance of the WinstonLoggerService
   * @static
   * @returns {IWinstonLoggerService} The singleton instance of WinstonLoggerService
   */
  public static getInstance(): IWinstonLoggerService {
    if (!WinstonLoggerService.instance) {
      WinstonLoggerService.instance = new WinstonLoggerService()
    }
    return WinstonLoggerService.instance
  }

  /**
   * Ensures the log directory exists, creates it if not present
   * @private
   * @returns {void}
   */
  private ensureLogDirectoryExists(): void {
    if (!fs.existsSync(this.logDir)) {
      try {
        fs.mkdirSync(this.logDir, { recursive: true })
      } catch (error) {
        console.error(`Failed to create log directory: ${this.logDir}`, error)
      }
    }
  }

  /**
   * Reconfigures the logger with new settings
   * @param {Object} options - Configuration options
   * @param {string} [options.logLevel] - New log level to apply
   * @returns {void}
   */
  public reconfigureLogger(options: { logLevel?: string}): void {
    let needsRecreate = false

    if (options.logLevel && options.logLevel !== this.logLevel) {
      this.logLevel = options.logLevel
      needsRecreate = true
    }

    if (needsRecreate) {
      this.logger = this.createLogger()
    }
  }

  /**
   * Creates and configures the Winston logger instance
   * @private
   * @returns {winston.Logger} Configured Winston logger instance
   */
  private createLogger(): winston.Logger {
    // Define the custom log format
    const baseLogFormat = printf(({ level, message, context, requestId, timestamp, metadata, stack }) => {
      const formattedContext = context ? context.toString().trim() : '-'
      const formattedRequestId = requestId ? requestId.toString().trim() : 'unknown'
      const formattedMetadata = metadata ? JSON.stringify(metadata) : '-'

      let logMessage = `${ timestamp } | ${ level.padEnd(7) } | ${ formattedContext } | ${ formattedRequestId } | ${ message } | ${ formattedMetadata }`

      if (stack) {
        logMessage += `\n${stack}`
      }

      return logMessage
    })

    // Create the logger instance with console and daily rotation file transports
    const loggerInstance = createLogger({
      level: this.logLevel,
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS A' }),
        label({ label: 'application' }),
        errors({ stack: true }),
        align(),
        splat(),
      ),
      transports: [
        // Console transport
        new transports.Console({
          format: combine(
            colorize(),
            baseLogFormat
          )
        }),

        // DailyRotateFile transport for all logs
        new DailyRotateFile({
          dirname: this.logDir,
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true, // Compress old log files
          maxSize: '2m',
          maxFiles: '14d', // Retain logs for 14 days
          format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
            align(),
            uncolorize(),
            baseLogFormat
          )
        }),

        // DailyRotateFile transport for error logs
        new DailyRotateFile({
          dirname: this.logDir,
          filename: `$error-%DATE%.log`,
          datePattern: 'YYYY-MM-DD-HH',
          level: 'error',
          zippedArchive: true,
          maxSize: '2m',
          maxFiles: '14d',
          format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
            align(),
            uncolorize(),
            baseLogFormat
          )
        })
      ]
    })

    return loggerInstance
  }

  /**
   * Formats the context information for logging
   * @private
   * @param {ILogContext | string | string[] | undefined} context - The context information to format
   * @returns {string} Formatted context string
   */
  private formatContext(context: ILogContext | string | string[] | undefined): string {
    if (!context) return '-'

    if (typeof context === 'string') return context

    // Context is an array
    if(Array.isArray(context)) {
      const [module, method, route, action] = context
      return this.formatObjectContext({ module, method, route, action })
    }

    // Context is an object
    return this.formatObjectContext(context)
  }

  /**
   * Formats the context from an object structure
   * @private
   * @param {ILogContext} context - The context object to format
   * @returns {string} Formatted context string
   */
  private formatObjectContext(context: ILogContext): string {
    // Build context string from object
    const parts = []
    if (context.module) parts.push(context.module)
    if (context.method) parts.push(context.method)
    if (context.action) parts.push(context.action)
    if (context.route) parts.push(context.route)

    return parts.length > 0 ? parts.join('::') : '-'
  }

  /**
   * Logs an informational message
   * @param {string | ILogParams} messageOrParams - Log message string or params object
   * @param {ILogContext | string | string[]} [context] - Context for the log message (e.g., module, method, route, action)
   * @param {string} [requestId] - Unique identifier for request tracing (generated if not provided)
   * @param {any} [metadata] - Additional structured data to be logged
   * @returns {void}
   */
   public info(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any): void {
    let params: ILogParams
    
    if (typeof messageOrParams === 'string') {
      params = {
        message: messageOrParams,
        context,
        requestId: requestId || uuidv4(),
        metadata: metadata || {}
      }
    } else {
      params = messageOrParams
      params.requestId = params.requestId || requestId || uuidv4()
      params.metadata = params.metadata || metadata || {}
    }
    
    this.logger.info({
      message: params.message,
      context: this.formatContext(params.context),
      requestId: params.requestId,
      metadata: params.metadata
    })
  }

  /**
   * Logs an error message
   * @param {string | ILogParams} messageOrParams - Log message string or params object
   * @param {ILogContext | string | string[]} [context] - Context for the log message
   * @param {string} [requestId] - Unique identifier for request tracing
   * @param {any} [metadata] - Additional structured data to be logged
   * @param {Error} [error] - Error object containing stack trace information
   * @returns {void}
   */
  public error(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any, error?: Error): void {
    let params: ILogParams

    if (typeof messageOrParams === 'string') {
      params = {
        message: messageOrParams,
        context,
        requestId: requestId || uuidv4(),
        metadata: metadata || {},
        error
      }
    } else {
      params = {
        message: messageOrParams.message,
        context: messageOrParams.context || context,
        requestId: messageOrParams.requestId || requestId || uuidv4(),
        metadata: messageOrParams.metadata || metadata || {},
        error: messageOrParams.error || error
      }
    }
    this.logger.error({
      message: params.message,
      context: this.formatContext(params.context),
      requestId: params.requestId,
      metadata: params.metadata,
      stack: params.error?.stack
    })
  }

  /**
   * Logs a warning message
   * @param {string | ILogParams} messageOrParams - Log message string or params object
   * @param {ILogContext | string | string[]} [context] - Context for the log message
   * @param {string} [requestId] - Unique identifier for request tracing
   * @param {any} [metadata] - Additional structured data to be logged
   * @returns {void}
   */
  public warn(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any): void {
    let params: ILogParams
    
    if (typeof messageOrParams === 'string') {
      params = {
        message: messageOrParams,
        context,
        requestId: requestId || uuidv4(),
        metadata: metadata || {}
      }
    } else {
      params = messageOrParams
      params.requestId = params.requestId || uuidv4()
      params.metadata = params.metadata || {}
    }
    
    this.logger.warn({
      message: params.message,
      context: this.formatContext(params.context),
      requestId: params.requestId,
      metadata: params.metadata
    })
  }

  /**
   * Logs a debug message for development troubleshooting
   * @param {string | ILogParams} messageOrParams - Log message string or params object
   * @param {ILogContext | string | string[]} [context] - Context for the log message
   * @param {string} [requestId] - Unique identifier for request tracing
   * @param {any} [metadata] - Additional structured data to be logged
   * @returns {void}
   */
  public debug(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any): void {
    let params: ILogParams
    
    if (typeof messageOrParams === 'string') {
      params = {
        message: messageOrParams,
        context,
        requestId: requestId || uuidv4(),
        metadata: metadata || {}
      }
    } else {
      params = messageOrParams
      params.requestId = params.requestId || requestId || uuidv4()
      params.metadata = params.metadata || metadata || {}
    }
    
    this.logger.debug({
      message: params.message,
      context: this.formatContext(params.context),
      requestId: params.requestId,
      metadata: params.metadata
    })
  }

  /**
   * Logs a verbose message for detailed application flow information
   * @param {string | ILogParams} messageOrParams - Log message string or params object
   * @param {ILogContext | string | string[]} [context] - Context for the log message
   * @param {string} [requestId] - Unique identifier for request tracing
   * @param {any} [metadata] - Additional structured data to be logged
   * @returns {void}
   */
  public verbose(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any): void {
    let params: ILogParams
    
    if (typeof messageOrParams === 'string') {
      params = {
        message: messageOrParams,
        context,
        requestId: requestId || uuidv4(),
        metadata: metadata || {}
      }
    } else {
      params = messageOrParams
      params.requestId = params.requestId || uuidv4()
      params.metadata = params.metadata || {}
    }
    
    this.logger.verbose({
      message: params.message,
      context: this.formatContext(params.context),
      requestId: params.requestId,
      metadata: params.metadata
    })
  }

  /**
   * Logs HTTP request/response information
   * @param {string | ILogParams} messageOrParams - Log message string or params object
   * @param {ILogContext | string | string[]} [context] - Context for the log message
   * @param {string} [requestId] - Unique identifier for request tracing
   * @param {any} [metadata] - Additional structured data to be logged
   * @returns {void}
   */
  public http(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any): void {
    let params: ILogParams
    
    if (typeof messageOrParams === 'string') {
      params = {
        message: messageOrParams,
        context,
        requestId: requestId || uuidv4(),
        metadata: metadata || {}
      }
    } else {
      params = messageOrParams
      params.requestId = params.requestId || uuidv4()
      params.metadata = params.metadata || {}
    }
    
    this.logger.http({
      message: params.message,
      context: this.formatContext(params.context),
      requestId: params.requestId,
      metadata: params.metadata
    })
  }
}

// Example usage
// const logger = WinstonLoggerService.getInstance()
// const contextObj = { module: 'Controller', method: 'GET', route: '/api/v1/resource', action: 'fetch' }
// const contextArray = ['Controller', 'GET', '/api/v1/resource', 'fetch']
// const requestId = uuidv4()
// const metadata = { userId: 123, action: 'fetch' }
// const error = new Error('Huhu, something went wrong')

// logger.debug('This is an info test message 1')
// logger.debug('This is a debug test message 2', contextObj)
// logger.debug('This is a debug test message 3', contextArray)
// logger.debug('This is a debug test message 4', contextObj, requestId)
// logger.debug('This is a debug test message 5', contextArray, requestId)
// logger.debug('This is a debug test message 6', contextObj, requestId, metadata)
// logger.debug('This is a debug test message 7', contextArray, requestId, metadata)

// logger.error('This is an error test message 1')
// logger.error('This is an error test message 2', contextObj)
// logger.error('This is an error test message 3', contextArray)
// logger.error('This is an error test message 4', contextObj, requestId)
// logger.error('This is an error test message 5', contextArray, requestId)
// logger.error('This is an error test message 6', contextObj, requestId, metadata)
// logger.error('This is an error test message 7', contextArray, requestId, metadata)
// logger.error('This is an error test message 7', contextObj, requestId, metadata, error)
// logger.error('This is an error test message 8', contextArray, requestId, metadata, error)
// logger.error(error)

// logger.info('User logged in', { module: 'Auth', action: 'login' }, 'req-123', { userId: 123 });
// logger.info({ message: 'User logged in', context: ['Auth', 'POST', '/login'], metadata: { userId: 123 } });
