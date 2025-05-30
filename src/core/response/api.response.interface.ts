/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-11 14:23:08
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-22 16:06:54
 * @FilePath      : /server/src/core/response/api.response.interface.ts
 * @Description   : API response interface for standardizing API responses and API response services
 */

import { TranslationKeys } from '~/shared/types'

/**
 * Interface for API response metadata
 * @interface IApiResponseMetadata
 * @property {number} [page] - Current page number for paginated responses
 * @property {number} [limit] - Number of items per page
 * @property {number} [total] - Total number of items
 * @property {number} [totalPage] - Total number of pages
 */
export interface IApiResponseMetadata {
  page?: number
  limit?: number
  total?: number
  totalPage?: number
  [key: string]: any
}

/**
 * Interface for API error details
 * @interface IApiErrorDetails
 * @property {string} message - Detailed error message explaining the issue
 * @property {string} [code] - Unique error code for identifying the error type
 * @property {string} [field] - Specific field or property that caused the error
 * @property {any} [key: string] - Additional error properties that may be required
 */
export interface IApiErrorDetails {
  message: string
  code?: string
  field?: string
  [key: string]: any
}

/**
 * Interface for API response options
 * @interface IApiResponseOptions
 * @template T - Type of data returned in the response
 * @property {'success' | 'error'} status - Response status indicating success or failure
 * @property {TranslationKeys} translationKey - Key for message localization/internationalization
 * @property {string} message - Human-readable message describing the response
 * @property {T} [data] - Response payload data (typically present in success responses)
 * @property {string} [code] - Custom code for identifying specific response types
 * @property {number} [statusCode] - HTTP status code (follows standard HTTP status conventions)
 * @property {IApiResponseMetadata} [metadata] - Additional metadata for pagination, filtering, etc.
 * @property {Record<string, IApiErrorDetails>} [errors] - Structured validation/error details keyed by field name
 * @property {string} [requestId] - Unique identifier for request tracing and debugging
 * @property {string} [timestamp] - ISO formatted timestamp when the response was generated
 */
export interface IApiResponseOptions<T> {
  status: 'success' | 'error'
  translationKey: TranslationKeys
  message: string
  data?: T
  code?: string
  statusCode?: number
  metadata?: IApiResponseMetadata
  errors?: Record<string, IApiErrorDetails>
  requestId?: string
  timestamp?: string
}
