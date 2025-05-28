/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-28 11:24:30
 * @FilePath      : /server/src/common/utils/env.ts
 * @Description   : Utility functions for loading and validating environment variables
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import fs from 'fs'
import { z, ZodError } from 'zod'
import { getCallerLocation } from '~/common/helpers'
import { ILogContext, WinstonLoggerService } from '~/infrastructure/loggers'
import { validateZodSchema } from '~/common/utils'
import { HTTP_STATUS } from '~/shared/constants'
import { IEnvLoadingOptions, IEnvLoadingResult } from '~/shared/interfaces'

const logger = WinstonLoggerService.getInstance()

/**
 * Load environment variables from .env files
 * 
 * @public
 * @param {object} options - Optional configuration for loading environment variables
 * @param {string} [options.path] - Path to the .env file (default: process.cwd()/.env)
 * @param {boolean} [options.override] - Whether to override existing environment variables (default: false)
 * @returns {Promise<void>} A Promise that resolves when environment variables are loaded
 * @throws {Error} In production environment if loading fails
 * @description
 * Loads environment variables from .env files with support for environment-specific overrides.
 * First loads from base .env file, then loads from environment-specific .env file if available
 * (e.g. .env.development, .env.production, .env.test) with override capability.
 */
export const loadEnv = async (options: IEnvLoadingOptions): Promise<IEnvLoadingResult> => {
  // Destructure options with defaults
  const {
    path: envPath = path.resolve(process.cwd(), '.env'), // Default to .env in current working directory
    override = false, // By default, don't override existing environment variables
    encoding = 'utf8', // Default encoding for reading .env files
  } = options
  
  // Track loaded and failed files for detailed result reporting, save absolute paths
  const loadedFiles: string[] = []
  const failedFiles: string[] = []
  
  // Set up logging context for consistent logging structure
  const context: ILogContext = {
    module: 'Config',
    method: 'loadEnv',
    route: getCallerLocation(), // Get caller file/line for better debugging
    action: 'LOAD_ENV'
  }

  try {
    // Load base .env file
    const baseEnvLoadSuccess = await loadSingleEnvFile(envPath, { override, encoding })
    if (baseEnvLoadSuccess) {
      loadedFiles.push(envPath)
    } else {
      failedFiles.push(envPath)

      // In production, base .env file is considered critical - fail if missing
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Failed to load critical environment file: ${envPath}`)
      }
    }

    // Load environment-specific .env file (.env.development, .env.production, etc.)
    // Determine current environment (default to development if not specified)
    const nodeEnv = typeof process.env.NODE_ENV === 'string' 
      ? process.env.NODE_ENV.toLowerCase() 
      : 'development'
    
    // List of supported environment types
    const validEnvs = ['development', 'production', 'test', 'staging']
    
    if (validEnvs.includes(nodeEnv)) {
      const envSpecificPath = path.resolve(process.cwd(), `.env.${nodeEnv}`)
    
      // Load environment-specific file if it exists and is different from base file
      if (envSpecificPath !== envPath && fs.existsSync(envSpecificPath)) {
        // Environment-specific files should override base .env values
        const envSpecificSuccess = await loadSingleEnvFile(envSpecificPath, { 
          override: true, encoding
        })
      
        if (envSpecificSuccess) {
          loadedFiles.push(envSpecificPath)
        } else {
          failedFiles.push(envSpecificPath)
        }
      }
    }

    // Load .env.local file (highest priority local overrides)
    // This file is typically git-ignored and used for local development overrides
    const localEnvPath = path.resolve(process.cwd(), '.env.local')
    if (fs.existsSync(localEnvPath)) {
      // Local files always override all previous env settings
      const localFileSuccess = await loadSingleEnvFile(localEnvPath, {
        override: true,
        encoding
      })
      
      if (localFileSuccess) {
        loadedFiles.push(localEnvPath)
      } else {
        failedFiles.push(localEnvPath)
      }
    }

    // Prepare the result object with loading statistics
    const result: IEnvLoadingResult = {
      success: loadedFiles.length > 0, // Success if at least one file loaded
      loadedFiles,
      failedFiles,
      totalFiles: loadedFiles.length + failedFiles.length
    }

    // Log appropriate message based on loading result
    if (result.success) {
      // Log successful loading with detailed breakdown
      logger.info({
        message: `Environment variables loaded successfully`,
        context,
        requestId: '-',
        metadata: {
          environment: nodeEnv,
          totalFiles: result.totalFiles,
          loadedFiles: loadedFiles.map(f => path.basename(f)),
          loadedFileCount: loadedFiles.length,
          ...(failedFiles.length > 0 && { 
            failedFileCount: failedFiles.length,
            failedFiles: failedFiles.map(f => path.basename(f))
          })
        }
      })
    } else {
      // Log warning if no files could be loaded
      logger.warn({
        message: 'No environment files could be loaded',
        context,
        requestId: '-',
        metadata: {
          attempted: result.totalFiles,
          failedFiles: failedFiles.map(f => path.basename(f))
        }
      })
    }

    return result
  } catch (error) {
    // Log critical error with available context
    logger.error({
      message: 'Critical error loading environment variables',
      context,
      requestId: '-',
      error: error as Error,
      metadata: {
        loadedFiles: loadedFiles.length,
        failedFiles: failedFiles.length
      }
    })

    throw error
  }
}

/**
 * Load a single environment file
 * 
 * @private
 * @param {string} filePath - Path to the .env file
 * @param {object} options - Loading options
 * @param {boolean} options.override - Whether to override existing environment variables
 * @param {BufferEncoding} options.encoding - Character encoding to use when reading the file
 * @returns {Promise<boolean>} A Promise that resolves to true if file was loaded successfully, false otherwise
 * @description
 * Attempts to load environment variables from a specified file path.
 * Returns false if the file doesn't exist or an error occurs during loading.
 * Logs debug information if loading fails.
 */
export const loadSingleEnvFile = async (
  filePath: string,
  options: {
    override: boolean,
    encoding: BufferEncoding
  }
): Promise<boolean> => {
  try {
    // Check if file exists before attempting to load
    if (!fs.existsSync(filePath)) return false

    // Use dotenv.config() to parse and load environment variables from the file
    const result = dotenv.config({
      path: filePath,
      override: options.override ?? false, // Control whether to override existing env vars
      encoding: options.encoding ?? 'utf8' // Use specified encoding or default to utf8
    })

    // Return true if the file was loaded successfully (no error from dotenv)
    return !result.error
  } catch (error) {
    logger.debug({
      message: `Failed to load environment file: ${path.basename(filePath)}`,
      context: {
        module: 'Config',
        method: 'loadSingleEnvFile',
        route: getCallerLocation(),
        action: 'LOAD_SINGLE_ENV_FILE'
      },
      requestId: '-',
      error: error as Error
    })

    return false
  }
}

/**
 * Validate environment variables against a Zod schema
 * 
 * @public
 * @param {z.ZodType} schema - Zod schema to validate the environment variables against
 * @param {Record<string, any>} data - Data to validate (default: process.env)
 * @returns {Promise<z.infer<T>>} A Promise that resolves to the typed and validated environment variables
 * @throws {Error} In production environment if validation fails
 * @description
 * Validates environment variables against a provided Zod schema, ensuring type safety and data integrity.
 * Provides detailed error logging for invalid configurations and different behavior based on environment:
 * - In production: Throws generic errors to prevent sensitive information exposure
 * - In development: Returns detailed error messages for debugging
 */
export const validateEnv = async <T extends z.ZodType>(
  schema: T,
): Promise<z.infer<T>> => {
  const context: ILogContext = { module: 'Config', method: 'validateEnv', route: getCallerLocation(), action: 'VALIDATE_ENV' }

  try {
    // Validate process.env against the provided schema with our shared validation utility
    // This uses zod-validator-core for consistent validation handling across the application
    const validatedEnv = await validateZodSchema(schema, process.env, {
      errorMessage: 'Invalid environment configuration',
      errorStatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR // Use 500 error code for env issues
    })

    // Log successful validation without exposing sensitive environment values
    logger.debug({
      message: 'Environment variables validated successfully',
      context,
      requestId: '-',
      metadata: {
        validatedVariables: Object.keys(validatedEnv).length, // Only log count, not values for security
      }
    })
    
    // Return the validated and typed environment variables
    return validatedEnv
  } catch (error) {
    if (error instanceof ZodError) {
      // Format Zod validation errors for better readability in logs
      const formattedZodErrors = error.errors.map(err =>
        `${err.path.join('.')}: ${err.message}`
      )

      // Log detailed validation errors for debugging purposes
      logger.error({
        message: `Environment validation failed`,
        context,
        requestId: '-',
        metadata: { errors: formattedZodErrors },
      })

      // Security: Adjust error message detail based on environment
      // - Production: Generic message to avoid leaking sensitive configuration details
      // - Development: Detailed message for easier debugging
      const errorMessage = process.env.NODE_ENV === 'production' 
        ? 'Invalid environment configuration. Check server logs for details.'
        : `Environment validation failed:\n${formattedZodErrors.join('\n')}`
      
      throw new Error(errorMessage)
    } else {
      // Handle unexpected non-validation errors
      const err = error instanceof Error ? error : new Error(String(error))
      
      logger.error({
        message: 'Unknown error during environment validation',
        context,
        requestId: '-',
        metadata: { error: err.message },
        error: err,
      })
      
      throw err
    }
  }
}

// Usage example:
// const bootstrap = async () => {
//   // Load environment variables
//   const loadResult = await loadEnv({ 
//     path: '.env',
//     override: false
//   })
  
//   console.log('Environment loading result:', loadResult)

//   // Define validation schema
//   const envSchema = z.object({
//     NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
//     PORT: z.coerce.number().default(3000),
//     DB_HOST: z.string().default('localhost'),
//     DB_PORT: z.coerce.number().default(5432),
//     DB_PASSWORD: z.string(),
//     DB_NAME: z.string(),
//   })

//   // Validate environment variables
//   const env = await validateEnv(envSchema)

//   console.log('Validated environment:', {
//     NODE_ENV: env.NODE_ENV,
//     PORT: env.PORT,
//     DB_HOST: env.DB_HOST,
//     DB_PORT: env.DB_PORT
//   })
// }

// bootstrap().catch(err => {
//   console.error('Error during bootstrap:', err)
// })
