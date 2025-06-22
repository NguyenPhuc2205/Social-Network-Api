/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 00:12:22
 * @FilePath      : /server/src/shared/constants/response-codes.ts
 * @Description   : Response codes for consistent API response handling
 */

import { HTTP_STATUS } from './http-status.constant'

export const RESPONSE_CODES = Object.freeze({
  // Success codes (2xx)
  SUCCESS: { code: 'SUCCESS', defaultStatus: HTTP_STATUS.OK }, // General success
  CREATED: { code: 'CREATED', defaultStatus: HTTP_STATUS.CREATED }, // Resource created
  ACCEPTED: { code: 'ACCEPTED', defaultStatus: HTTP_STATUS.ACCEPTED }, // Request accepted
  NO_CONTENT: { code: 'NO_CONTENT', defaultStatus: HTTP_STATUS.NO_CONTENT }, // No content returned

  // Client error codes (4xx)
  BAD_REQUEST: { code: 'BAD_REQUEST', defaultStatus: HTTP_STATUS.BAD_REQUEST },
  UNAUTHORIZED: { code: 'UNAUTHORIZED', defaultStatus: HTTP_STATUS.UNAUTHORIZED },
  FORBIDDEN: { code: 'FORBIDDEN', defaultStatus: HTTP_STATUS.FORBIDDEN },
  NOT_FOUND: { code: 'NOT_FOUND', defaultStatus: HTTP_STATUS.NOT_FOUND },
  METHOD_NOT_ALLOWED: { code: 'METHOD_NOT_ALLOWED', defaultStatus: HTTP_STATUS.METHOD_NOT_ALLOWED },
  CONFLICT: { code: 'CONFLICT', defaultStatus: HTTP_STATUS.CONFLICT },
  GONE: { code: 'GONE', defaultStatus: HTTP_STATUS.GONE },
  REQUEST_TIMEOUT: { code: 'REQUEST_TIMEOUT', defaultStatus: HTTP_STATUS.REQUEST_TIMEOUT },
  UNSUPPORTED_MEDIA_TYPE: { code: 'UNSUPPORTED_MEDIA_TYPE', defaultStatus: HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE },
  UNPROCESSABLE_ENTITY: { code: 'UNPROCESSABLE_ENTITY', defaultStatus: HTTP_STATUS.UNPROCESSABLE_ENTITY },
  TOO_EARLY: { code: 'TOO_EARLY', defaultStatus: HTTP_STATUS.TOO_EARLY },
  PRECONDITION_REQUIRED: { code: 'PRECONDITION_REQUIRED', defaultStatus: HTTP_STATUS.PRECONDITION_REQUIRED },
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', defaultStatus: HTTP_STATUS.UNPROCESSABLE_ENTITY },
  TOO_MANY_REQUESTS: { code: 'TOO_MANY_REQUESTS', defaultStatus: HTTP_STATUS.TOO_MANY_REQUESTS },
  UNAVAILABLE_FOR_LEGAL_REASONS: { code: 'UNAVAILABLE_FOR_LEGAL_REASONS', defaultStatus: HTTP_STATUS.UNAVAILABLE_FOR_LEGAL_REASONS },

  // Server error codes (5xx)
  INTERNAL_SERVER_ERROR: { code: 'INTERNAL_SERVER_ERROR', defaultStatus: HTTP_STATUS.INTERNAL_SERVER_ERROR },
  NOT_IMPLEMENTED: { code: 'NOT_IMPLEMENTED', defaultStatus: HTTP_STATUS.NOT_IMPLEMENTED },
  BAD_GATEWAY: { code: 'BAD_GATEWAY', defaultStatus: HTTP_STATUS.BAD_GATEWAY },
  SERVICE_UNAVAILABLE: { code: 'SERVICE_UNAVAILABLE', defaultStatus: HTTP_STATUS.SERVICE_UNAVAILABLE },
  GATEWAY_TIMEOUT: { code: 'GATEWAY_TIMEOUT', defaultStatus: HTTP_STATUS.GATEWAY_TIMEOUT },
  INSUFFICIENT_STORAGE: { code: 'INSUFFICIENT_STORAGE', defaultStatus: HTTP_STATUS.INSUFFICIENT_STORAGE },

  // Custom business codes
  USER_NOT_VERIFIED: { code: 'USER_NOT_VERIFIED', defaultStatus: HTTP_STATUS.FORBIDDEN },
} as const)
