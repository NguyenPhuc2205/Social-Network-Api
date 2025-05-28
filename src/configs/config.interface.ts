/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-26 23:54:31
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-28 14:26:07
 * @FilePath      : /server/src/configs/config.interface.ts
 * @Description   : Configuration Service Interface Definition
 */

import { MergedEnvSchema } from '~/configs/env-schemas'
import { IEnvLoadingOptions } from '~/shared/interfaces'

/**
 * Interface for Configuration Service
 * Provides contract for environment configuration management with validation.
 * @interface IConfigService
 */
export interface IConfigService {
  /**
   * Initialize the configuration service with environment loading and validation
   * @param {IEnvLoadingOptions} [options] - Environment loading options
   * @returns {Promise<IConfigService>} Initialized service instance
   * @throws {Error} If initialization fails (invalid environment variables)
   */
  initialized(options?: IEnvLoadingOptions): Promise<IConfigService>

  /**
   * Get the complete validated configuration object
   * @returns {MergedEnvSchema} The validated configuration object
   * @throws {Error} If service is not properly initialized
   */
  getConfig(): MergedEnvSchema

  /**
   * Get a specific configuration value by key with type safety
   * @template K - Type of configuration key
   * @param {K} key - The configuration key to retrieve
   * @returns {MergedEnvSchema[K]} The typed configuration value for the specified key
   * @throws {Error} If service is not properly initialized
   */
  get<K extends keyof MergedEnvSchema>(key: K): MergedEnvSchema[K]

  /**
   * Get raw environment variable value without validation
   * @param {string} key - Environment variable name
   * @returns {string | undefined} Raw environment variable value or undefined if not set
   */
  getRawConfigValue(key: string): string | undefined

  /**
   * Check if the service has been properly initialized
   * @returns {boolean} Indicates initialization status
   */
  isServiceInitialized(): boolean

  /**
   * Check if initialization is currently in progress
   * @returns {boolean} Indicates if initialization is ongoing
   */
  isInitializing(): boolean

  /**
   * Wait for initialization to complete if it's currently in progress
   * @returns {Promise<IConfigService | null>} Service instance or null if initialization failed
   */
  waitForInitialization(): Promise<IConfigService | null>

  /**
   * Reset the service state for testing or hot reload scenarios
   * @returns {void}
   */
  reset(): void

  /**
   * Reinitialize the service with new configuration options
   * @param {IEnvLoadingOptions} [options] - Environment loading options
   * @returns {Promise<IConfigService>} Reinitialized service instance
   * @throws {Error} If reinitialization fails
   */
  reinitialize(options?: IEnvLoadingOptions): Promise<IConfigService>
}
