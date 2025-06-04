/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-01 22:29:45
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-02 01:06:03
 * @FilePath      : /server/src/common/middlewares/language-detection.middleware.ts
 * @Description   : Middleware for detecting and setting user's language preference
 */

import { NextFunction, Request, Response } from 'express-serve-static-core'
import { inject, injectable } from 'inversify'
import { DI_TYPES } from '~/core/providers'
import { IWinstonLoggerService } from '~/infrastructure/loggers'

/**
 * Middleware responsible for detecting and setting user's language preference
 * Detects language from URL path, query string, cookies, and Accept-Language header
 */
@injectable()
export class LanguageDetectionMiddleware {
  /**
   * List of languages supported by the application
   * @private
   * @readonly
   */
  private readonly supportedLanguages = ['en', 'fr', 'es', 'vi']
  
  /**
   * Default language to use when no preference is detected
   * @private
   * @readonly
   */
  private readonly defaultLanguage = 'en'
  
  /**
   * Creates an instance of LanguageDetectionMiddleware
   * @param {IWinstonLoggerService} loggerService - Service for logging information and errors
   */
  constructor(
    @inject(DI_TYPES.IWinstonLoggerService)
    private loggerService: IWinstonLoggerService,
  ) {}

  /**
   * Express middleware function that detects user language preference
   * Sets the language on request object and in response locals
   * Also sets a language cookie if not already set
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   */
  public handle(req: Request, res: Response, next: NextFunction): void {
    let detectedLanguage: string | undefined
    let detectionSource: string | undefined

    // First try to detect language from URL path segments
    const urlLanguage = this.extractLanguageFromUrl(req)
    if (urlLanguage && this.supportedLanguages.includes(urlLanguage)) {
      detectedLanguage = urlLanguage
      detectionSource = 'URL'
    }

    // If not found in URL, check query string parameter 'lang'
    if (!detectedLanguage) {
      const queryLanguage = req.query.lang as string;
      if (queryLanguage && this.supportedLanguages.includes(queryLanguage.toLowerCase())) {
        detectedLanguage = queryLanguage.toLowerCase();
        detectionSource = 'Query String';
      }
    }

    // If not found in query, check cookies for language preference
    if (!detectedLanguage) {
      const cookieLanguage = req.cookies?.lang;
      if (cookieLanguage && this.supportedLanguages.includes(cookieLanguage.toLowerCase())) {
        detectedLanguage = cookieLanguage.toLowerCase();
        detectionSource = 'Cookie';
      }
    }

    // If still not found, check Accept-Language HTTP header
    if (!detectedLanguage) {
      const headerLanguage = req.headers['accept-language'];
      if (headerLanguage) {
        // Extract primary language from Accept-Language header
        const primaryLanguage = headerLanguage.split(',')[0].split('-')[0].toLowerCase();
        if (this.supportedLanguages.includes(primaryLanguage)) {
          detectedLanguage = primaryLanguage;
          detectionSource = 'Accept-Language Header';
        }
      }
    }

    // If no language detected, use default language
    detectedLanguage = detectedLanguage || this.defaultLanguage;
    detectionSource = detectionSource || 'Default';

    // Set the detected language on both request object and response locals
    // This makes it accessible to route handlers and view templates
    req.language = detectedLanguage;
    res.locals.language = detectedLanguage;

    // Set a cookie with the detected language for future requests
    // Skip if the language was already detected from a cookie
    if (detectionSource !== 'Cookie') {
      res.cookie('lang', detectedLanguage, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiration
        httpOnly: true, // Not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // Prevents CSRF attacks
      });
    }

    // Log language detection information for audit and debugging
    this.loggerService.info({
      message: `Detected language: ${detectedLanguage} from ${detectionSource}`,
      context: {
        module: 'LanguageDetectionMiddleware',
        method: req.method,
        route: req.originalUrl,
        action: 'DETECT_LANGUAGE',
      },
      requestId: req.request_id || 'unknown',
      metadata: { language: detectedLanguage, source: detectionSource },
    });

    // Continue to next middleware in the chain
    next();
  }

  /**
   * Extracts language code from URL path segments
   * Example: for URL "/en/products", it would extract "en"
   * 
   * @param {Request} req - Express request object
   * @returns {string|undefined} - The detected language code or undefined if not found
   * @private
   */
  private extractLanguageFromUrl(req: Request): string | undefined {
    // Split URL path into segments and remove empty parts
    const urlParts = req.path.split('/').filter((part) => part.length > 0)
    
    // Check each segment against supported languages
    for (const part of urlParts) {
      if (this.supportedLanguages.includes(part.toLowerCase())) {
        return part.toLowerCase()
      }
    }
    
    return undefined
  }
}
