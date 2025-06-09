/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-21 09:54:31
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-22 16:02:26
 * @FilePath      : /server/src/infrastructure/loggers/winston.interface.ts
 * @Description   : Interface for the Winston Logger
 */

import { ISerializeConfig } from '~/common/utils'

/**
 * Interface for logging context information
 * @interface ILogContext
 * @property {string} [module] - Component/module generating the log (e.g., 'UserController', 'AuthService')
 * @property {string} [method] - Method name or HTTP method (e.g., 'createUser', 'GET', 'POST')
 * @property {string} [route] - API route or function path (e.g., '/api/v1/users', 'processPayment')
 * @property {string} [action] - Specific action being performed (e.g., 'create', 'validate', 'fetch')
 */
export interface ILogContext {
  module?: string // Component/module (Controller, Service, etc.)
  method?: string // Method name or HTTP method
  route?: string  // API route or function path
  action?: string // Specific action being performed
}

/**
 * Interface for log message parameters
 * @interface ILogParams
 * @property {string} message - Main log message content
 * @property {ILogContext | string | string[]} [context] - Context information for the log
 * @property {string} [requestId] - Unique identifier for request tracing
 * @property {any} [metadata] - Additional structured data to be logged
 * @property {Error} [error] - Error object for error logging
 */
export interface ILogParams {
  message: string
  context?: ILogContext | string | string[]
  requestId?: string
  metadata?: any
  error?: Error
}

/**
 * Interface for Winston Logger implementation
 * @interface IWinstonLoggerService
 */
export interface IWinstonLoggerService {
  /**
   * Log an informational message
   * @param {string | ILogParams} messageOrParams - Log message string or params object
   * @param {ILogContext | string | string[]} [context] - Context for the log message
   * @param {string} [requestId] - Unique identifier for request tracing
   * @param {any} [metadata] - Additional structured data to be logged
   * @returns {void}
   */
  info(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any): void
  
  /**
   * Log an error message
   * @param {string | ILogParams} messageOrParams - Log message string or params object
   * @param {ILogContext | string | string[]} [context] - Context for the log message
   * @param {string} [requestId] - Unique identifier for request tracing
   * @param {any} [metadata] - Additional structured data to be logged
   * @param {Error} [error] - Error object containing stack trace information
   * @returns {void}
   */
  error(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any, error?: Error): void

  /**
   * Log a warning message
   * @param {string | ILogParams} messageOrParams - Log message string or params object
   * @param {ILogContext | string | string[]} [context] - Context for the log message
   * @param {string} [requestId] - Unique identifier for request tracing
   * @param {any} [metadata] - Additional structured data to be logged
   * @returns {void}
   */
  warn(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any): void

  /**
   * Log a debug message
   * @param {string | ILogParams} messageOrParams - Log message string or params object
   * @param {ILogContext | string | string[]} [context] - Context for the log message
   * @param {string} [requestId] - Unique identifier for request tracing
   * @param {any} [metadata] - Additional structured data to be logged
   * @returns {void}
   */
  debug(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any): void

  /**
   * Log a verbose message for detailed application flow
   * @param {string | ILogParams} messageOrParams - Log message string or params object
   * @param {ILogContext | string | string[]} [context] - Context for the log message
   * @param {string} [requestId] - Unique identifier for request tracing
   * @param {any} [metadata] - Additional structured data to be logged
   * @returns {void}
   */
  verbose(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any): void

  /**
   * Log an HTTP request/response information
   * @param {string | ILogParams} messageOrParams - Log message string or params object
   * @param {ILogContext | string | string[]} [context] - Context for the log message
   * @param {string} [requestId] - Unique identifier for request tracing
   * @param {any} [metadata] - Additional structured data to be logged
   * @returns {void}
   */
  http(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any): void

  /**
   * Reconfigure logger with new options at runtime
   * @param {IWinstonLoggerConfig} options - Configuration options
   * @param {string} [options.logLevel] - New log level (e.g., 'debug', 'info', 'warn', 'error')
   * @param {string} [options.logDir] - New directory for log files
   * @param {ISerializeConfig} [options.serializeConfig] - Updated serialization configuration
   * @param {Object} [options.fileRotation] - Updated file rotation settings
   * @returns {void}
   */
  reconfigureLogger(options: IWinstonLoggerConfig): void
}

/**
 * Configuration interface for WinstonLoggerService
 * @interface IWinstonLoggerConfig
 * @property {string} [logLevel] - Log level ('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
 * @property {string} [logDir] - Directory where log files will be stored
 * @property {ISerializeConfig} [serializeConfig] - Configuration for metadata serialization
 * @property {Object} [fileRotation] - Configuration for log file rotation
 * @property {string} [fileRotation.datePattern] - Date pattern for rotation (e.g., 'YYYY-MM-DD-HH')
 * @property {string} [fileRotation.maxSize] - Maximum size of log files before rotation (e.g., '10m')
 * @property {string} [fileRotation.maxFiles] - Maximum number/age of files to keep (e.g., '14d', '10')
 * @property {boolean} [fileRotation.zippedArchive] - Whether to compress rotated logs
 */
export interface IWinstonLoggerConfig {
  logLevel?: string
  logDir?: string
  serializeConfig?: ISerializeConfig
  fileRotation?: {
    datePattern?: string
    maxSize?: string
    maxFiles?: string
    zippedArchive?: boolean
  }
}
