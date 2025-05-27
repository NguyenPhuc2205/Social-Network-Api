/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-27 23:29:41
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-27 23:45:08
 * @FilePath      : /server/src/shared/interfaces/env-config.interface.ts
 * @Description   : Interface for environment variable configuration loading options
 */

/**
 * Configuration options for loading environment variables.
 * 
 * @interface IEnvLoadingOptions
 * @property {string} [path] - Custom path to the .env file to load
 * @property {boolean} [override] - Whether to override existing environment variables
 * @property {BufferEncoding} [encoding] - Character encoding to use when reading .env files
 * @property {boolean} [debug] - Whether to enable debug mode for verbose logging
 * @property {number} [maxRetries] - Maximum number of retry attempts when loading fails
 * @property {number} [retryDelay] - Delay in milliseconds between retry attempts
 */
export interface IEnvLoadingOptions {
  /**
   * Custom path to the .env file to load.
   * 
   * @type {string}
   */
  path?: string
  
  /**
   * Whether to override existing environment variables with values from the .env file.
   * When false, existing environment variables take precedence over .env values.
   * 
   * @type {boolean}
   * @default false
   */
  override?: boolean
  
  /**
   * Character encoding to use when reading .env files.
   * 
   * @type {BufferEncoding}
   * @default 'utf-8'
   */
  encoding?: BufferEncoding
  
  /**
   * Whether to enable debug mode for verbose logging of environment loading process.
   * 
   * @type {boolean}
   * @default false
   */
  debug?: boolean
  
  /**
   * Maximum number of retry attempts when loading fails.
   * 
   * @type {number}
   * @default 0
   */
  maxRetries?: number
  
  /**
   * Delay in milliseconds between retry attempts.
   * 
   * @type {number}
   * @default 100
   */
  retryDelay?: number
}

/**
 * Environment variable configuration result.
 * 
 * @interface IEnvLoadingResult
 * @property {boolean} success - Whether the loading operation was successful
 * @property {string} path - Path to the .env file that was loaded or attempted to load
 * @property {Error} [error] - Error object if the loading operation failed
 * @property {Record<string, string>} [parsed] - Parsed environment variables from the file
 * @property {number} [retryCount] - Number of retries attempted for this file
 */
export interface IEnvLoadingResult {
  /**
   * Whether the loading operation was successful.
   * 
   * @type {boolean}
   */
  success: boolean
  
  /**
   * Path to the .env file that was loaded or attempted to load.
   * 
   * @type {string}
   */
  path: string
  
  /**
   * Error object if the loading operation failed.
   * 
   * @type {Error}
   */
  error?: Error
  
  /**
   * Parsed environment variables from the file.
   * 
   * @type {Record<string, string>}
   */
  parsed?: Record<string, string>
  
  /**
   * Number of retries attempted for this file.
   * 
   * @type {number}
   */
  retryCount?: number
}

/**
 * Loading summary for multiple environment file operations.
 * 
 * @interface IEnvLoadingSummary
 * @property {number} totalFiles - Total number of .env files processed
 * @property {string[]} successfulFiles - Array of paths to successfully loaded files
 * @property {string[]} failedFiles - Array of paths to files that failed to load
 * @property {number} totalRetries - Total number of retry attempts across all files
 * @property {IEnvLoadingResult[]} allResults - Array of detailed results for each file
 */
export interface IEnvLoadingSummary {
  /**
   * Total number of .env files processed.
   * 
   * @type {number}
   */
  totalFiles: number
  
  /**
   * Array of paths to successfully loaded files.
   * 
   * @type {string[]}
   */
  successfulFiles: string[]
  
  /**
   * Array of paths to files that failed to load.
   * 
   * @type {string[]}
   */
  failedFiles: string[]
  
  /**
   * Total number of retry attempts across all files.
   * 
   * @type {number}
   */
  totalRetries: number
  
  /**
   * Array of detailed results for each file processed.
   * 
   * @type {IEnvLoadingResult[]}
   */
  allResults: IEnvLoadingResult[]
}
