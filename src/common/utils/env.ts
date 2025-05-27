/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-27 22:59:32
 * @FilePath      : /project/server/src/common/utils/env.ts
 * @Description   : Utility functions for loading and validating environment variables
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import fs from 'fs'
import { z, ZodError } from 'zod'
import { getCallerLocation } from '~/common/helpers'
import { WinstonLoggerService } from '~/infrastructure/loggers'
import { validateZodSchema } from '~/common/utils'
import { HTTP_STATUS } from '~/shared/constants'

/**
 * Configuration options for loading environment variables
 * 
 * @interface IEnvLoadOptions
 * @property {string} [path] - Path to the .env file (default: process.cwd()/.env)
 * @property {boolean} [override] - Whether to override existing environment variables (default: false)
 */
interface IEnvLoadOptions {
  path?: string;
  override?: boolean;
}

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
export const loadEnv = async (options?: IEnvLoadOptions): Promise<void> => {
  try {
    // Load env file from the specified path or default to .env
    const envPath = options?.path || path.resolve(process.cwd(), '.env')

    // Check if .env file exists at the specified path
    if (!fs.existsSync(envPath)) {
      logger.warn({
        message: `No .env file path ${envPath}, using default values for environment variables`,
        context: { module: 'Config', method: 'loadEnv', route: getCallerLocation(), action: 'LOAD_ENV' },
        requestId: '-',
      })
      return
    }

    logger.debug({
      message: `Loading environment variables from: ${envPath}`,
      context: { module: 'Config', method: 'loadEnv', route: getCallerLocation(), action: 'LOAD_ENV' },
      requestId: '-',
    })

    // Load environment variables from .env file
    const result = dotenv.config({
      path: envPath,
      override: options?.override ?? false,
    })

    if (result.error) {
      logger.warn({
        message: `Failed to load environment variables from ${envPath}: ${result.error}`,
        context: { module: 'Config', method: 'loadEnv', route: getCallerLocation(), action: 'LOAD_ENV' },
        requestId: '-',
      })

      // In production, loading env vars is critical - fail fast with a detailed error
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Failed to load environment variables from ${envPath}: ${result.error}`)
      }
    } else {
      logger.debug({
        message: `Environment variables loaded successfully from ${envPath}`,
        context: { module: 'Config', method: 'loadEnv', route: getCallerLocation(), action: 'LOAD_ENV' },
        requestId: '-',
      })
    }
    
    // Load environment variables from .env.NODE_ENV & override existing ones
    // This allows for environment-specific configuration (development, production, test)
    const validEnvs: string[] = ['development', 'production', 'test'] as const
    const nodeEnv: string = (process.env.NODE_ENV as string)?.toLowerCase() || 'development'
    if (nodeEnv && ['development', 'production', 'test'].includes(nodeEnv)) {
      const envSpecificPath = path.resolve(
        process.cwd(),
        `.env.${process.env.NODE_ENV}`.toLowerCase()
      )

      if (envSpecificPath !== envPath && fs.existsSync(envSpecificPath)) {
        logger.debug({
          message: `Loading specified environment variables from: ${envSpecificPath}`,
          context: { module: 'Config', method: 'loadEnv', route: getCallerLocation(), action: 'LOAD_ENV' },
          requestId: '-',
        })
        
        const specifiedLoadResult = dotenv.config({
          path: envSpecificPath,
          override: options?.override ?? false,
        })

        if (specifiedLoadResult.error) {
          logger.warn({
            message: `Failed to load environment variables from ${envSpecificPath}: ${specifiedLoadResult.error}`,
            context: { module: 'Config', method: 'loadEnv', route: getCallerLocation(), action: 'LOAD_ENV' },
            requestId: '-',
          })

          // In production, loading env vars is critical - fail fast with a detailed error
          if (process.env.NODE_ENV === 'production') {
            throw new Error(`Failed to load environment variables from ${envSpecificPath}: ${specifiedLoadResult.error.message}`)
          }
        } else {
          logger.debug({
            message: `Environment variables loaded successfully from ${envSpecificPath}`,
            context: { module: 'Config', method: 'loadEnv', route: getCallerLocation(), action: 'LOAD_ENV' },
            requestId: '-',
          })
        }
      }
    }

    // Log successful loading of environment variables
    logger.info({
      message: 'Environment variables loaded successfully',
      context: { module: 'Config', method: 'loadEnv', route: getCallerLocation(), action: 'LOAD_ENV' },
      requestId: '-',
    })

  } catch (error) {
    logger.error({
      message: `Error loading environment variables`,
      context: { module: 'Config', method: 'loadEnv', route: getCallerLocation(), action: 'LOAD_ENV' },
      requestId: '-',
      metadata: {},
      error: error as Error,
    })

    throw error
  }
}

/**
 * Validate environment variables against a Zod schema
 * 
 * @public
 * @param {z.ZodType} schema - Zod schema to validate the environment variables against
 * @returns {Promise<z.infer<T>>} A Promise that resolves to the typed and validated environment variables
 * @throws {Error} In production environment if validation fails
 * @description
 * Validates environment variables against a provided Zod schema, ensuring type safety and data integrity.
 * Provides detailed error logging for invalid configurations and different behavior based on environment:
 * - In production: Throws errors for invalid configurations to prevent startup with bad settings
 * - In development: Returns empty/default values to allow graceful continuation with partial configuration
 * 
 * @example
 * const envSchema = z.object({
 *   NODE_ENV: z.enum(['development', 'production', 'test']),
 *   PORT: z.coerce.number().default(3000),
 *   DB_PASSWORD: z.string(),
 * });
 * const env = await validateEnv(envSchema);
 */
export const validateEnv = async <T extends z.ZodType>(
  schema: T,
): Promise<z.infer<T>> => {
  try {
    // Parse environment variables with the provided schema
    // This uses the zod-validator-core utility for consistent validation handling
    const validatedEnv = await validateZodSchema(schema, process.env, {
      errorMessage: 'Invalid environment configuration',
      errorStatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR
    })

    // Log the secure environment variables for debugging
    logger.debug({
      message: 'Secure environment variables validated successfully',
      context: { module: 'Config', method: 'validateEnv', route: getCallerLocation(), action: 'VALIDATE_ENV' },
      requestId: '-'
    })
    
    return validatedEnv
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error({
        message: `Environment validation failed`,
        context: { module: 'Config', method: 'validateEnv', route: getCallerLocation(), action: 'VALIDATE_ENV' },
        requestId: '-',
        metadata: { errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`) },
      })

      // In production, validation errors are critical - fail fast with a generic error
      // Detailed errors are already logged above for security reasons
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Invalid environment configuration. See logs for details.')
      }
    } else {
      const err = error instanceof Error ? error : new Error(String(error))
      logger.error({
        message: 'Unknown error during environment validation',
        context: { module: 'Config', method: 'validateEnv', route: getCallerLocation(), action: 'VALIDATE_ENV' },
        requestId: '-',
        metadata: { error: err.message },
        error: err,
      })
      throw err
    }
    
    throw error
  }
}

// Usage example
// loadEnv({ path: '.env' })

// const boostrap = async () => {
//   const envSchema = z.object({
//     NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
//     PORT: z.coerce.number().default(3000),
//     DB_HOST: z.string().default('localhost'),
//     DB_PORT: z.coerce.number().default(5432),
//     DB_PASSWORD: z.string(),
//     DB_NAME: z.string(),
//   })

//   const env = await validateEnv(envSchema)

//   console.log('Environment variables: ', env)
//   console.log('Server listening on port', env.PORT)
// }

// boostrap().catch(err => { console.log('Error during bootstrap:', err) })
