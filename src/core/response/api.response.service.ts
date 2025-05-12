/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-11 12:39:16
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-11 14:20:32
 * @FilePath      : /server/src/core/response/api.response.service.ts
 * @Description   : Api response service for handling API responses
 */

import { Request } from 'express'
import { inject, injectable } from 'inversify'
import { DI_TYPES } from '~/core/providers'
import { IApiResponseService } from '~/core/response/api.response.interface'
import { II18nService } from '~/infrastructure/i18n'
import { IWinstonLoggerService } from '~/infrastructure/loggers'

/**
 * Service for handling API response message resolution
 * @class ApiResponseService
 * @implements {IApiResponseService}
 * @description Handles message resolution for API responses, with support for internationalization (i18n)
 * and message fallbacks. Provides consistent message handling across the application.
 */
@injectable()
export class ApiResponseService implements IApiResponseService {
  private static DEFAULT_MESSAGE = 'Unknown message.'

  /**
   * Creates an instance of ApiResponseService
   * @constructor
   * @param {II18nService} i18nService - Service for handling internationalization
   * @param {IWinstonLoggerService} logger - Service for logging
   */
  constructor(
    @inject(DI_TYPES.II18nService) private i18nService: II18nService,
    @inject(DI_TYPES.IWinstonLoggerService) private logger: IWinstonLoggerService
  ) {}

  /**
   * Resolves the response message based on provided options
   * @param {Object} options - Message resolution options
   * @param {string} options.messageKey - Key for message localization
   * @param {string} [options.message] - Fixed message to use (when preferFixedMessage is true or as fallback)
   * @param {boolean} [options.preferFixedMessage] - Whether to prioritize fixed message over localized message
   * @param {Request} [options.req] - Express request object for i18n context
   * @param {string} [options.defaultMessage] - Fallback message if translation fails and no message is provided
   * @returns {string} Resolved message (localized or fixed)
   */
  public resolveMessage (options: {
    message?: string,
    messageKey: string,
    preferFixedMessage?: boolean,
    req?: Request,
    defaultMessage?: string,
  }): string {
    const { message, messageKey, preferFixedMessage, req, defaultMessage = ApiResponseService.DEFAULT_MESSAGE } = options

    // Prior fixed message
    if (preferFixedMessage && message) {
      return message
    }

    // Translate messageKey via i18n and assign to message
    try {
      const translatedMessage: string = this.i18nService.translate(messageKey, req)

      if (!translatedMessage || translatedMessage === messageKey) {
        // If translation fails, use default message
        this.logger.warn({
          message: `Translation not found for messageKey: ${messageKey}`,
          context: {
            module: 'ApiResponseService',
            method: req?.method,
            route: req?.originalUrl,
            action: 'RESOLVE_MESSAGE'
          },
          requestId:
            req?.request_id ||
            (typeof req?.headers['x-request-id'] === 'string' ? req?.headers['x-request-id'] : 'unknown'),
        })

        return message || defaultMessage
      }

      // If translation is successful, return the translated message
      return translatedMessage
    } catch (error) {
      this.logger.error({
        message: `Translation error for messageKey: ${messageKey}`,
        context: {
          module: 'ApiResponseService',
          method: req?.method,
          route: req?.originalUrl,
          action: 'RESOLVE_MESSAGE'
        },
        requestId:
          req?.request_id ||
          (typeof req?.headers['x-request-id'] === 'string' ? req?.headers['x-request-id'] : 'unknown'),
      })

      return message || defaultMessage
    }
  }
}
