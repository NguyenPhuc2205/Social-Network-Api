import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'

/**
 * Type definition for validation errors
 * Each error contains a message and optional additional properties
 * @example
 * {
 *   email: { msg: "Invalid email format" },
 *   password: { msg: "Password too short", minLength: 8 }
 * }
 */
type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

/**
 * Base error class for errors with HTTP status codes
 * Used for all errors except validation errors (422)
 */
export class ErrorWithStatus {
  message: string
  status: number
  otherInfo?: object

  /**
   *
   * @param root0
   * @param root0.message
   * @param root0.status
   * @param root0.otherInfo
   */
  constructor({ message, status, otherInfo }: { message: string; status: number; otherInfo?: object }) {
    this.message = message
    this.status = status
    if (otherInfo) this.otherInfo = otherInfo
  }
}

/**
 * Specialized error class for validation errors (422 Unprocessable Entity)
 * Used when request data fails validation rules
 */
export class EntityError extends ErrorWithStatus {
  errors: ErrorsType

  /**
   *
   * @param root0
   * @param root0.message
   * @param root0.errors
   */
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
