/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-26 23:54:31
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-30 21:08:22
 * @FilePath      : /server/src/configs/config.service.ts
 * @Description   : Configuration Service with Environment Loading and Validation
 */

/**
 * Notes:
 * - This service uses a promise-based singleton initialization pattern
 * - This approach prevents resource waste when multiple modules request initialization simultaneously
 * - During initialization, if other modules call ConfigService.initialized(), they'll await the in-progress initialization
 * - This ensures that environment loading and validation happen exactly once
 */

import { inject, injectable } from 'inversify'
import { getCallerLocation } from '~/common/helpers'
import { loadEnv, validateEnv } from '~/common/utils'
import { IConfigService } from '~/configs/config.interface'
import { mergedEnvSchema, MergedEnvSchema } from '~/configs'
import { DI_TYPES } from '~/core/providers'
import { IWinstonLoggerService } from '~/infrastructure/loggers'
import { IEnvLoadingOptions } from '~/shared/interfaces'

/**
 * Configuration Service Implementation providing centralized access to environment configuration
 * @class ConfigService
 * @implements {IConfigService}
 */
@injectable()
export class ConfigService implements IConfigService {
  /**
   * Singleton instance of the ConfigService
   * @private
   * @static
   * @type {IConfigService | null}
   */
  private static instance: IConfigService | null = null
  
  /**
   * Flag indicating if initialization has completed successfully
   * @private
   * @static
   * @type {boolean}
   */
  private static isInitialized = false
  
  /**
   * Promise tracking any ongoing initialization process
   * @private
   * @static
   * @type {Promise<IConfigService> | null}
   */
  private static initializationPromise: Promise<IConfigService> | null = null

  /**
   * The validated configuration object obtained after schema validation
   * @private
   * @type {MergedEnvSchema | null}
   */
  private validatedConfig: MergedEnvSchema | null = null

  /**
   * Creates an instance of ConfigService
   * @param {IWinstonLoggerService} loggerService - Logger service for recording initialization and runtime events
   */
  constructor(
    @inject(DI_TYPES.IWinstonLoggerService) 
    private loggerService: IWinstonLoggerService
  ) {}

  /**
   * Get the singleton instance of ConfigService
   * @returns {IConfigService} The singleton instance
   */
  public static getInstance(): IConfigService {
    if (!ConfigService.instance || !ConfigService.isInitialized) {
      throw new Error('ConfigService is not initialized. Call ConfigService.initialized() first.')
    }
    return ConfigService.instance
  }

  /**
   * Initialize ConfigService with Promise management to avoid race conditions
   * @param {IEnvLoadingOptions} [options={ path: '.env' }] - Environment loading options
   * @returns {Promise<IConfigService>} Initialized service instance
   */
  public async initialized(options: IEnvLoadingOptions = { path: '.env' }): Promise<IConfigService> {
    // Fast path: If already initialized, return the instance immediately
    if (ConfigService.isInitialized && ConfigService.instance) return ConfigService.instance
  
    // If initialization is in progress, wait for current promise to resolve instead of starting a new one
    if (ConfigService.initializationPromise) {
      this.loggerService.info({
        message: 'ConfigService is already being initialized. Waiting for completion...',
        context: { 
          module: 'ConfigService', 
          method: 'initialized', 
          route: getCallerLocation(), 
          action: 'WAIT_FOR_INITIALIZATION'
        },
        requestId: '-'
      })

      return ConfigService.initializationPromise
    }

    // Create a new initialization promise using the actual initialization method
    ConfigService.initializationPromise = this.performInitialization(options)

    try {
      // Await the initialization to complete
      const result = await ConfigService.initializationPromise
      return result
    } catch (error) {
      // Reset the initialization promise on error to allow retrying
      ConfigService.initializationPromise = null
      throw error      
    }
  }

  /**
   * Perform the actual initialization process
   * @private
   * @param {IEnvLoadingOptions} options - Environment loading options
   * @returns {Promise<IConfigService>} Initialized service instance
   */
  private async performInitialization(options: IEnvLoadingOptions): Promise<IConfigService> {
    try {
      this.loggerService.info({
        message: 'Starting ConfigService initialization...',
        context: { 
          module: 'ConfigService',
          method: 'performInitialization',
          route: getCallerLocation(), 
          action: 'START_INITIALIZATION'
        },
        requestId: '-'
      })

      // Load environment variables from file with provided options
      await loadEnv(options)

      // Validate the loaded environment variables against the schema
      // This ensures type safety and completeness of the configuration
      this.validatedConfig = await validateEnv(mergedEnvSchema)

      // Update static properties to indicate successful initialization
      ConfigService.isInitialized = true
      ConfigService.instance = this

      this.loggerService.info({
        message: 'ConfigService initialized successfully',
        context: { 
          module: 'ConfigService',
          method: 'performInitialization',
          route: getCallerLocation(), 
          action: 'INITIALIZATION_SUCCESS'
        },
        requestId: '-'
      })

      return this
    } catch (error) {
      this.loggerService.error({
        message: 'Failed to initialize ConfigService',
        context: { 
          module: 'ConfigService', 
          method: 'performInitialization', 
          route: getCallerLocation(), 
          action: 'INITIALIZATION_ERROR' 
        },
        requestId: '-',
        error: error as Error,
      })

      // In production environment, fail fast to prevent undefined behavior
      // This ensures the application doesn't run with invalid configuration
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Failed to initialize ConfigService. Application cannot continue.')
      }
      
      throw error
    }
  }

  /**
   * Get the complete validated configuration object
   * @returns {MergedEnvSchema} The validated configuration object
   * @throws {Error} If service is not properly initialized
   */
  public getConfig(): MergedEnvSchema {
    if (!this.validatedConfig) {
      const errorMessage = 'ConfigService is not properly initialized.'
      this.loggerService.error({
        message: errorMessage,
        context: {
          module: 'ConfigService',
          method: 'getConfig',
          route: getCallerLocation(),
          action: 'GET_INVALID_CONFIG'
        },
        requestId: '-'
      })
      throw new Error(errorMessage)
    }

    return this.validatedConfig
  }

  /**
   * Get a specific configuration value by key with type safety
   * @template K - Type of configuration key
   * @param {K} key - The configuration key to retrieve
   * @returns {MergedEnvSchema[K]} The typed configuration value for the specified key
   * @throws {Error} If service is not properly initialized
   */
  public get<K extends keyof MergedEnvSchema>(key: K): MergedEnvSchema[K] {
    if (!this.validatedConfig) {
      throw new Error('ConfigService is not properly initialized.')
    }

    return this.validatedConfig[key]
  }

  /**
   * Get raw environment variable value without validation
   * @param {string} key - Environment variable name
   * @returns {string | undefined} Raw environment variable value or undefined if not set
   */
  public getRawConfigValue(key: string): string | undefined {
    const value = process.env[key]
    
    if (value === undefined) {
      this.loggerService.warn({
        message: `Environment variable "${key}" is not defined`,
        context: {
          module: 'ConfigService',
          method: 'getRawConfigValue',
          route: getCallerLocation(),
          action: 'GET_UNDEFINED_ENV_VAR'
        },
        requestId: '-'
      })
    }
    
    return value
  }

  /**
   * Check if the service has been properly initialized
   * @returns {boolean} Indicates initialization status
   */
  public isServiceInitialized(): boolean {
    return ConfigService.isInitialized && ConfigService.instance !== null
  }

  /**
   * Check if initialization is currently in progress
   * @returns {boolean} Indicates if initialization is ongoing
   */
  public isInitializing(): boolean {
    return ConfigService.initializationPromise !== null && !ConfigService.isInitialized
  }

  /**
   * Wait for initialization to complete if it's currently in progress
   * @returns {Promise<IConfigService | null>} Service instance or null if initialization failed
   */
  public async waitForInitialization(): Promise<IConfigService | null> {
    // Fast path: If already initialized, return the instance immediately
    if (ConfigService.isInitialized && ConfigService.instance) {
      return ConfigService.instance
    }

    // If initialization is in progress, wait for it to complete
    if (ConfigService.initializationPromise) {
      try {
        return await ConfigService.initializationPromise
      } catch (error) {
        this.loggerService.warn({
          message: 'Initialization failed while waiting',
          context: {
            module: 'ConfigService',
            method: 'waitForInitialization',
            route: getCallerLocation(),
            action: 'WAIT_INITIALIZATION_FAILED'
          },
          requestId: '-',
          error: error as Error
        })
        return null
      }
    }

    // No initialization in progress
    return null
  }

  /**
   * Reset the service state for testing or hot reload scenarios
   * @returns {void}
   */
  public reset(): void {
    this.loggerService.info({
      message: 'Resetting ConfigService',
      context: {
        module: 'ConfigService',
        method: 'reset',
        route: getCallerLocation(),
        action: 'RESET_SERVICE'
      },
      requestId: '-'
    })

    // Clear all state to allow fresh initialization
    ConfigService.instance = null
    ConfigService.isInitialized = false
    ConfigService.initializationPromise = null
    this.validatedConfig = null
  }

  /**
   * Reinitialize the service with new configuration options
   * @param {IEnvLoadingOptions} [options={}] - Environment loading options
   * @returns {Promise<IConfigService>} Reinitialized service instance
   */
  public async reinitialize(options: IEnvLoadingOptions = {}): Promise<IConfigService> {
    this.loggerService.info({
      message: 'Reinitializing ConfigService',
      context: {
        module: 'ConfigService',
        method: 'reinitialize',
        route: getCallerLocation(),
        action: 'REINITIALIZE_SERVICE'
      },
      requestId: '-'
    })

    // Reset first to clear all state
    this.reset()
    
    // Then initialize with the new options
    return this.initialized(options)
  }
}

// Example usage
// import { bindConfigsModule } from '~/configs/config.module'
// import { DIContainer } from '~/core/providers/di.container'
// import { bindWinstonLoggerModule } from '~/infrastructure/loggers/winston.module'
// async function testConfigService() {
//   const container = DIContainer.getInstance()
//   container.registerModule(bindConfigsModule)
//   container.registerModule(bindWinstonLoggerModule)
//   container.initialize()

//   const configService = container.getContainer().get<IConfigService>(DI_TYPES.IConfigService)
//   await configService.initialized()

//   const instance = ConfigService.getInstance()
//   console.log('Config Service Instance: ', instance instanceof ConfigService)

//   const config = configService.getConfig()
//   console.log('All config: ', config)

//   console.log('NODE_ENV: ', configService.get('NODE_ENV' as keyof MergedEnvSchema))

//   const rawValue = configService.getRawConfigValue('NODE_ENV')
//   console.log('Raw value: ', rawValue)

//   const undefinedValue = configService.getRawConfigValue('NON_EXISTENT_KEY')
//   console.log('Value of undefined key: ', undefinedValue)

//   console.log('isServiceInitialized: ', configService.isServiceInitialized())
//   console.log('isInitializing: ', configService.isInitializing())

//   configService.reset()
//   console.log('After reset: ', configService.isServiceInitialized())

//   // Reinitialize => Call intialized again => Call performInitialization => LoadEnv => ValidateEnv =>...
//   await configService.reinitialize({ path: '.env' })
//   console.log('Reinitialized: ', configService.isServiceInitialized())
// }

// testConfigService().catch((error) => {
//   console.error('Failed to test: ', error.message)
// })
