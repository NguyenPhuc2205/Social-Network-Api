/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-01 15:58:18
 * @FilePath      : /server/src/infrastructure/loggers/winston.service.ts
 * @Description   : Create a logger using Winston with daily rotation and custom formatting
 */

import fs from 'fs'
import path from 'path'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { ILogContext, ILogParams, IWinstonLoggerConfig, IWinstonLoggerService } from '~/infrastructure/loggers/winston.interface'
import { v4 as uuidv4 } from 'uuid'
import { injectable } from 'inversify'
import util from 'util'
import { ISerializeConfig, safeSerialize } from '~/common/utils'

const { createLogger, format, transports } = winston
const { combine, timestamp, splat, colorize, uncolorize, printf, align, label, errors } = format

/**
 * Winston implementation of the logger service
 * 
 * @class WinstonLoggerService
 * @implements {IWinstonLoggerService}
 * @description Provides structured logging capabilities with Winston transport
 */
@injectable()
export class WinstonLoggerService implements IWinstonLoggerService {
  private static instance: IWinstonLoggerService | null = null
  private logger: winston.Logger
  private logDir: string = path.resolve('logs')
  private logLevel: string = 'debug'
  private serializeConfig: ISerializeConfig
  private fileRotationConfig: Required<IWinstonLoggerConfig['fileRotation']>

  /**
   * Default configuration values
   */
  private static readonly DEFAULT_CONFIG: Required<IWinstonLoggerConfig> = {
    logLevel: 'debug',
    logDir: path.resolve('logs'),
    serializeConfig: {
      maxDepth: 3,
      maxArrayLength: 5,
      maxObjectKeys: 10,
      maxStackLines: 3,
    },
    fileRotation: {
      datePattern: 'YYYY-MM-DD-HH',
      maxSize: '2m',
      maxFiles: '14d',
      zippedArchive: true,
    }
  }

  /**
   * Merges user-provided configuration with default values
   * 
   * @private
   * @param {IWinstonLoggerConfig} config - User provided configuration
   * @returns {Required<IWinstonLoggerConfig>} Complete configuration with all required fields
   */
  private mergeWithDefaults(config: IWinstonLoggerConfig): Required<IWinstonLoggerConfig> {
    return {
      logLevel: config.logLevel ?? WinstonLoggerService.DEFAULT_CONFIG.logLevel,
      logDir: config.logDir ?? WinstonLoggerService.DEFAULT_CONFIG.logDir,
      serializeConfig: { 
        ...WinstonLoggerService.DEFAULT_CONFIG.serializeConfig, 
        ...config.serializeConfig 
      },
      fileRotation: { 
        ...WinstonLoggerService.DEFAULT_CONFIG.fileRotation, 
        ...config.fileRotation 
      } 
    }
  }

  /**
   * Creates a new Winston logger instance
   * @constructor
   */
  constructor(config: IWinstonLoggerConfig = {}) {
    // Merge config with defaults
    const mergedConfig = this.mergeWithDefaults(config)

    this.logLevel = mergedConfig.logLevel
    this.logDir = mergedConfig.logDir
    this.serializeConfig = mergedConfig.serializeConfig
    this.fileRotationConfig = mergedConfig.fileRotation as Required<IWinstonLoggerConfig['fileRotation']>

    this.ensureLogDirectoryExists()
    this.logger = this.createLogger()
  }

  /**
   * Gets the singleton instance of the WinstonLoggerService
   * 
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
   * 
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
   * Update serialize configuration at runtime
   * 
   * @param {Partial<ISerializeConfig>} newConfig - New serialization configuration to merge with existing config
   * @returns {void}
   */
  public updateSerializeConfig(newConfig: Partial<ISerializeConfig>): void {
    this.serializeConfig = { ...this.serializeConfig, ...newConfig }
  }

  /**
   * Get current serialize configuration
   * 
   * @returns {ISerializeConfig} A copy of the current serialization configuration
   */
  public getSerializeConfig(): ISerializeConfig {
    return { ...this.serializeConfig }
  }

  /**
   * Reconfigures the logger with new settings at runtime
   * This allows dynamic adjustment of logging behavior without application restart
   * 
   * @param {IWinstonLoggerConfig} options - Configuration options
   * @param {string} [options.logLevel] - New log level to apply (debug, info, warn, error)
   * @param {string} [options.logDir] - New directory for log files
   * @param {ISerializeConfig} [options.serializeConfig] - Updated serialization configuration
   * @param {Object} [options.fileRotation] - Updated file rotation settings
   * @returns {void}
   */
  public reconfigureLogger(options: IWinstonLoggerConfig): void {
    let needsRecreate = false

    // Change log level if provided and different from current
    if (options.logLevel && options.logLevel !== this.logLevel) {
      this.logLevel = options.logLevel
      needsRecreate = true // Logger recreation needed for level change
    }

    // Change log directory if provided and different from current
    if (options.logDir && options.logDir !== this.logDir) {
      this.logDir = options.logDir
      this.ensureLogDirectoryExists() // Make sure the new directory exists
      needsRecreate = true // Logger recreation needed for directory change
    }

    // Update serialization configuration if provided
    if (options.serializeConfig) {
      this.updateSerializeConfig(options.serializeConfig)
    }

    // Update file rotation settings if provided
    if (options.fileRotation) {
      this.fileRotationConfig = { ...this.fileRotationConfig, ...options.fileRotation } as Required<IWinstonLoggerConfig['fileRotation']>
      needsRecreate = true // Logger recreation needed for rotation settings change
    }

    // Only recreate logger if necessary (performance optimization)
    if (needsRecreate) {
      this.logger = this.createLogger()
    }
  }

  /**
   * Safely serialize metadata, avoiding logging the logger itself
   * Prevents circular references that would crash the logger by detecting Winston loggers
   * and replacing them with a simplified representation.
   * 
   * @private
   * @param {any} metadata - Metadata to serialize
   * @returns {any} Safely serialized metadata without circular references
   */
  private safeSerializeMetadata(metadata: any): any {
    if (!metadata) return {}

    // If metadata is an object with a logger property, serialize it safely
    if (metadata.logger && typeof metadata.logger === 'object' && metadata.logger.level) {
      return {
        ...safeSerialize(metadata, this.serializeConfig),
        logger: `[Winston Logger: level=${metadata.logger.level}]`
      }
    }

    // If metadata is a Winston logger instance, return a safe string representation
    if (metadata.level && metadata._readableState && metadata._writableState) {
      return `[Winston Logger: level=${metadata.level}]`
    }

    return safeSerialize(metadata, this.serializeConfig)
  }

  /**
   * Creates and configures the Winston logger instance
   * @private
   * @returns {winston.Logger} Configured Winston logger instance
   */
  private createLogger(): winston.Logger {
    // Define the base log format for file output
    const baseLogFormat = printf(({ level, message, context, requestId, timestamp, metadata, stack }) => {
      const formattedContext = context ? context.toString().trim() : '-'
      const formattedRequestId = requestId ? requestId.toString().trim() : 'unknown'
      let formattedMetadata = '-'

      if (metadata) {
        try {
          // Safely serialize metadata to prevent circular references
          formattedMetadata = JSON.stringify(this.safeSerializeMetadata(metadata))
        } catch (error) {
          formattedMetadata = `[Serialization Error]`          
        }
      }

      let logMessage = `${timestamp} | ${level.padEnd(7)} | ${formattedContext} | ${formattedRequestId} | ${message} | ${formattedMetadata}`

      if (stack) {
        logMessage += `\n${stack}`
      }

      return logMessage
    })

    // Define the console log format with colorization
    const consoleLogFormat = printf(({ level, message, context, requestId, timestamp, metadata, stack }) => {
      const formattedContext = context ? context.toString().trim() : '-'
      const formattedRequestId = requestId ? requestId.toString().trim() : 'unknown'
      const formattedMetadata = metadata ? util.inspect(metadata, { depth: 2, colors: true }) : {}

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
            consoleLogFormat
          )
        }),

        // DailyRotateFile transport for all logs
        new DailyRotateFile({
          dirname: this.logDir,
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH', // Date format in filename for hourly rotation
          zippedArchive: true, // Compress old log files to save space
          maxSize: '2m', // Maximum log file size before rotation (2MB)
          maxFiles: '14d', // Keep logs for 14 days
          format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
            align(),
            uncolorize(),
            baseLogFormat,
          )
        }),

        // DailyRotateFile transport for error logs only
        new DailyRotateFile({
          dirname: this.logDir,
          filename: `error-%DATE%.log`,
          datePattern: 'YYYY-MM-DD-HH',
          level: 'error', // Only capture error level logs in this transport
          zippedArchive: true,
          maxSize: '2m',
          maxFiles: '14d', // Retain error logs for 14 days
          format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
            align(),
            uncolorize(),
            baseLogFormat,
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
    if (context.route) parts.push(context.route)
    if (context.action) parts.push(context.action)

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

// logger.info('User logged in', { module: 'Auth', action: 'login' }, 'req-123', { userId: 123 })
// logger.info({ message: 'User logged in', context: ['Auth', 'POST', '/login'], metadata: { userId: 123 } })
