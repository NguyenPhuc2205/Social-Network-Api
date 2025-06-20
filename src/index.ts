/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-02 13:26:53
 * @FilePath      : /server/src/index.ts
 * @Description   : Main entry point for the application
 */

import 'reflect-metadata'
import http from 'http'
import { App } from '~/app'
import { Container } from 'inversify'
import { DI_TYPES, DIContainer } from '~/core/providers'
import { bindAppConfig, bindAuthConfig, bindCloudinaryConfig, bindConfigsModule, bindDatabaseConfig, bindOAuthConfig, IAppConfig, IConfigService } from '~/configs'
import { bindI18nModule, II18nService, initializeI18n } from '~/infrastructure/i18n'
import { bindWinstonLoggerModule, IWinstonLoggerService } from '~/infrastructure/loggers'
import { bindMiddlewares } from '~/common/middlewares'
import { bindDatabaseModule, IDatabaseConnection } from '~/infrastructure/database'

async function bootstrap() {
  try {
    // Create DI Container - InversifyJS
    const diContainer = DIContainer.getInstance()

    // Register all modules
    registerAllModules(diContainer)

    // Initialize DI Container
    diContainer.initialize()

    const container: Container = diContainer.getContainer()

    // Get the winston logger service from the DI Container
    const winstonLogger = container.get<IWinstonLoggerService>(DI_TYPES.IWinstonLoggerService)

    // Log the successful initialization of the DI Container
    winstonLogger.info(
      'Dependency Injection Container initialized successfully',
      { module: '-', method: 'bootstrap', route: '-', action: 'INITIALIZE_DI_CONTAINER' } , 
      '-' , 
      diContainer
    )

    // Load environment variables from .env file & Initialize Configuration
    const configService: IConfigService = container.get<IConfigService>(DI_TYPES.IConfigService)
    await configService.initialized()

    // Log the successful loading of environment variables
    winstonLogger.info(
      'Environment variables loaded successfully',
      { module: '-', method: 'bootstrap', route: '-', action: 'INITIALIZE_CONFIGURATIONS' },
      '-',
      configService.getConfig()
    )

    // Initialize database - mongodb connection
    const databaseConnection = container.get<IDatabaseConnection>(DI_TYPES.IDatabaseConnection)
    await databaseConnection.initialize()

    // Log the successful initialization of the database connection
    winstonLogger.info(
      'Database connection initialized successfully',
      { module: '-', method: 'bootstrap', route: '-', action: 'INITIALIZE_DATABASE' },
      '-',
      {
        connectionString: databaseConnection.getConnectionString(),
        ping: await databaseConnection.getDb().command({ ping: 1 }),
      }
    )

    // Initialize i18next instance
    const i18nextInstance = await initializeI18n()
    const i18nService = container.get<II18nService>(DI_TYPES.II18nService)

    // Log the successful initialization of i18next
    winstonLogger.info(
      'i18next initialized successfully',
      { module: '-', method: 'bootstrap', route: '-', action: 'INITIALIZE_I18N' },
      '-',
      { 
        languages: i18nService.getCurrentLanguage(),
        i18next: i18nextInstance.isInitialized,
      }
    )

    // Initialize the Application
    const app = new App(container, winstonLogger)
    await app.initialize()

    // Start listening for incoming requests
    const server = app.listen()

    // Handle graceful shutdown
    gracefulShutdown(server, app, container, winstonLogger, databaseConnection)

    // Log application start
    winstonLogger.info(
      'Application started successfully',
      { module: '-', method: 'bootstrap', route: '-', action: 'APPLICATION_START' },
      '-',
      { pid: process.pid }
    )
  } catch (error) {
    console.error('Failed to start the application:', error)
    process.exit(1)
  }
}

const gracefulShutdown = async (
  server: http.Server,
  app: App,
  container: Container,
  logger: IWinstonLoggerService,
  databaseConnection: IDatabaseConnection
) => {
  const signals = Object.freeze(['SIGINT', 'SIGTERM', 'SIGQUIT'] as const)

  for (const signal of signals) {
    process.on(signal, async () => {
      logger.info(
        `Received ${signal}, shutting down gracefully...`,
        { module: 'App', method: 'shutdown', route: '-', action: 'SHUTDOWN_INITIATED' },
        '-'
      )

      try {
        // Close database connection
        await databaseConnection.closeMongoDB()

        await new Promise<void>((resolve, reject) => {
          server.close(async (err) => {
            if (err) {
              logger.error(
                `Error closing HTTP server: ${err.message}`,
                { module: 'App', method: 'shutdown', route: '-', action: 'SHUTDOWN_ERROR' },
                '-',
                { error: err },
                err
              )
              reject(err)
            } else {
              logger.info(
                'HTTP server closed successfully',
                { module: 'App', method: 'shutdown', route: '-', action: 'SHUTDOWN_SUCCESS' },
                '-'
              )
              resolve()
            }
          })
        })
      } catch (error) {
        logger.error(
          `Error during shutdown`,
          { module: 'App', method: 'shutdown', route: '-', action: 'SHUTDOWN_CRITICAL_ERROR' },
          '-',
          { error },
          error instanceof Error ? error : new Error(String(error))
        )
      }

      process.exit(0)
    })
  }
}

const registerAllModules = (container: DIContainer) => {
  container.registerModuleBatch([
    bindConfigsModule,
    bindAppConfig,
    bindAuthConfig,
    bindCloudinaryConfig,
    bindDatabaseConfig,
    bindOAuthConfig,

    bindI18nModule,

    bindWinstonLoggerModule,

    bindDatabaseModule,

    bindMiddlewares,
  ])
}

bootstrap()
