/*
 * @Author       : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date         : 2025-02-21 09:54:31
 * @LastEditors: Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime: 2025-05-03 01:22:17
 * @FilePath     : server/src/infrastructure/loggers/logger.interface.ts
 * @Description  : Interface for the Winston Logger
 */

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
   * Reconfigure logger with new options
   * @param {Object} options - Configuration options
   * @param {string} [options.logLevel] - New log level (e.g., 'debug', 'info', 'warn', 'error')
   * @returns {void}
   */
  reconfigureLogger(options: { logLevel?: string }): void
}

