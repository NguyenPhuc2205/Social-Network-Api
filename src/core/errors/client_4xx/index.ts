/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-06 21:43:17
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-22 15:24:43
 * @FilePath      : /project/server/src/core/errors/client_4xx/index.ts
 * @Description   : Export all error classes and types from the client_4xx module
 */

export { BadRequestError } from '~/core/errors/client_4xx/bad-request.error'
export { ConflictError } from '~/core/errors/client_4xx/conflict.error'
export { ForbiddenError } from '~/core/errors/client_4xx/forbidden.error'
export { GoneError } from '~/core/errors/client_4xx/gone.error'
export { MethodNotAllowedError } from '~/core/errors/client_4xx/method-not-allowed.error'
export { NotFoundError } from '~/core/errors/client_4xx/not-found.error'
export { PreconditionRequiredError } from '~/core/errors/client_4xx/precondition-required.error'
export { RateLimitError } from '~/core/errors/client_4xx/rate-limit.error'
export { RequestTimeoutError } from '~/core/errors/client_4xx/request-timeout.error'
export { TooEarlyError } from '~/core/errors/client_4xx/too-early.error'
export { UnauthorizedError } from '~/core/errors/client_4xx/unauthorized.error'
export { UnavailableForLegalReasonsError } from '~/core/errors/client_4xx/unavailable-for-legal-reasons.error'
export { UnprocessableEntityError } from '~/core/errors/client_4xx/unprocessable-entity.error'
export { UnsupportedMediaTypeError } from '~/core/errors/client_4xx/unsupported-media-type.error'
export { ValidationError } from '~/core/errors/client_4xx/validation.error'
