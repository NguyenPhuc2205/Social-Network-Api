/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-27 23:29:41
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-28 10:28:54
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
}

/**
 * Environment variable loading operation result.
 * 
 * @interface IEnvLoadingResult
 * @property {boolean} success - Whether at least one environment file was loaded successfully
 * @property {string[]} loadedFiles - List of absolute paths to successfully loaded environment files
 * @property {string[]} failedFiles - List of absolute paths to environment files that failed to load
 * @property {number} totalFiles - Total number of environment files processed (loaded + failed)
 */
export interface IEnvLoadingResult {
  /**
   * Whether at least one environment file was loaded successfully.
   * 
   * @type {boolean}
   */
  success: boolean
  
  /**
   * List of absolute paths to successfully loaded environment files.
   * 
   * @type {string[]}
   */
  loadedFiles: string[]

  /**
   * List of absolute paths to environment files that failed to load.
   * 
   * @type {string[]}
   */
  failedFiles: string[]

  /**
   * Total number of environment files processed (loaded + failed).
   * 
   * @type {number}
   */
  totalFiles: number
}

