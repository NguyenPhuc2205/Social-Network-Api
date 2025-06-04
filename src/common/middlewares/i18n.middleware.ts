/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-07 23:23:26
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-02 01:04:32
 * @FilePath      : /server/src/common/middlewares/i18n.middleware.ts
 * @Description   : Middleware for handling internationalization (i18n) in Express applications (Improve on i18next-http-middleware)
 */

import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import i18next from 'i18next'
import { II18nService } from '~/infrastructure/i18n'
import middleware from 'i18next-http-middleware'
import { DI_TYPES } from '~/core/providers'
import { IWinstonLoggerService } from '~/infrastructure/loggers'

/**
 * Middleware responsible for setting up internationalization in Express
 * Integrates i18next with Express request/response objects
 */
@injectable()
export class I18nMiddleware {
  /**
   * Default language to use when no preference is detected
   * @private
   * @readonly
   */
  private readonly defaultLanguage = 'en'

  /**
   * Creates an instance of I18nMiddleware
   * @param {IWinstonLoggerService} loggerService - Service for logging information and errors
   * @param {II18nService} i18nService - Service for handling internationalization
   */
  constructor (
    @inject(DI_TYPES.IWinstonLoggerService)
    private loggerService: IWinstonLoggerService,

    @inject(DI_TYPES.II18nService)
    private i18nService: II18nService
  ) {}

  /**
   * Express middleware function that sets up i18n functionality
   * Detects language from request and configures i18next accordingly
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   */
  public handle(req: Request, res: Response, next: NextFunction): void {
    // Apply standard i18next HTTP middleware first
    // This registers t() functions on req, res.locals, etc.
    middleware.handle(i18next)(req, res, () => {
      // Get language from request object or use default
      const language = req.language || this.defaultLanguage
      
      // Change i18next instance language to match request language
      this.i18nService
        .changeLanguage(language)
        .then(() => {
          // Log successful language change for auditing
          this.loggerService.info({
            message: `i18n middleware applied with language: ${language}`,
            context: {
              module: 'I18nMiddleware',
              method: req.method,
              route: req.originalUrl,
              action: 'APPLY_I18N',
            },
            requestId: req.request_id || 'unknown',
            metadata: { language },
          })
        })
        .catch((error) => {
          // Log any errors that occur during language change
          this.loggerService.error({
            message: `Failed to change language to ${language}`,
            context: {
              module: 'I18nMiddleware',
              method: req.method,
              route: req.originalUrl,
              action: 'CHANGE_LANGUAGE',
            },
            requestId: req.request_id || 'unknown',
            metadata: {},
            error: error,
          })
        })
        
      // Continue to next middleware in the chain
      next()
    })
  }
}

