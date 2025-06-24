/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 00:18:51
 * @FilePath      : /server/src/shared/enums/common-translation.enum.ts
 * @Description   : Common translation keys enum for internationalization
 */

/**
 * Enumeration of common translation keys used throughout the application.
 * Format: 'common:KEY'
 * 
 * @enum {string}
 */
export enum CommonTranslationKeys {
  /** Success response (200) */
  SUCCESS = 'common:SUCCESS',
  
  /** Resource created successfully (201) */
  CREATED = 'common:CREATED',
  
  /** Request accepted for processing (202) */
  ACCEPTED = 'common:ACCEPTED',
  
  /** Request processed, no content to return (204) */
  NO_CONTENT = 'common:NO_CONTENT',
  
  /** Invalid request (400) */
  BAD_REQUEST = 'common:BAD_REQUEST',
  
  /** Authentication required (401) */
  UNAUTHORIZED = 'common:UNAUTHORIZED',
  
  /** User doesn't have permission (403) */
  FORBIDDEN = 'common:FORBIDDEN',
  
  /** Resource not found (404) */
  NOT_FOUND = 'common:NOT_FOUND',
  
  /** Resource conflict (409) */
  CONFLICT = 'common:CONFLICT',
  
  /** HTTP method not allowed (405) */
  METHOD_NOT_ALLOWED = 'common:METHOD_NOT_ALLOWED',
  
  /** Request timed out (408) */
  REQUEST_TIMEOUT = 'common:REQUEST_TIMEOUT',
  
  /** Resource no longer available (410) */
  GONE = 'common:GONE',
  
  /** Media type not supported (415) */
  UNSUPPORTED_MEDIA_TYPE = 'common:UNSUPPORTED_MEDIA_TYPE',
  
  /** Request content validation failed (422) */
  UNPROCESSABLE_ENTITY = 'common:UNPROCESSABLE_ENTITY',
  
  /** Request received too early (425) */
  TOO_EARLY = 'common:TOO_EARLY',
  
  /** Precondition required for request (428) */
  PRECONDITION_REQUIRED = 'common:PRECONDITION_REQUIRED',
  
  /** Input validation errors */
  VALIDATION_ERROR = 'common:VALIDATION_ERROR',
  
  /** Too many requests (429) */
  RATE_LIMIT_EXCEEDED = 'common:RATE_LIMIT_EXCEEDED',
  
  /** Content unavailable for legal reasons (451) */
  UNAVAILABLE_FOR_LEGAL_REASONS = 'common:UNAVAILABLE_FOR_LEGAL_REASONS',
  
  /** Server error (500) */
  INTERNAL_SERVER_ERROR = 'common:INTERNAL_SERVER_ERROR',
  
  /** Invalid response from upstream server (502) */
  BAD_GATEWAY = 'common:BAD_GATEWAY',
  
  /** Service temporarily unavailable (503) */
  SERVICE_UNAVAILABLE = 'common:SERVICE_UNAVAILABLE',
  
  /** Gateway timeout (504) */
  GATEWAY_TIMEOUT = 'common:GATEWAY_TIMEOUT',
  
  /** Storage space insufficient (507) */
  INSUFFICIENT_STORAGE = 'common:INSUFFICIENT_STORAGE',
  
  /** Functionality not implemented (501) */
  NOT_IMPLEMENTED = 'common:NOT_IMPLEMENTED',
  
  /** Unspecified error */
  UNKNOWN_ERROR = 'common:UNKNOWN_ERROR',
}
