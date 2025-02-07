import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

/**
 * @description A function returns an Express middleware for request validation.
 *
 * @param {RunnableValidationChains<ValidationChain>} validations - The validation chains that define the schema and rules for validating the request.
 * @returns {Function} An Express middleware function that validates the request, handles errors, and proceeds to the next middleware.
 *
 * The returned middleware:
 * - Executes the provided validation chains on the request.
 * - Checks for validation errors after execution.
 * - If no errors are found, it calls `next()` to continue the request processing.
 * - If validation errors are found:
 *   - If an error message is an instance of `ErrorWithStatus` and has a status code other than 422 (Unprocessable Entity),
 *     it directly passes the error to the next middleware.
 *   - Otherwise, it collects all validation errors, wraps them in an `EntityError`, and passes it to the next middleware.
 */

export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validations.run(req) //run validator in checkSchema and save err in req
    const errors = validationResult(req)

    // Continue request
    if (errors.isEmpty()) {
      return next()
    }

    // If validation fails, return a 422 status code and the errors
    const errorsObject = errors.mapped()
    const entityErrorObject = new EntityError({ errors: {} })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      //Error has status and 'has' status message != 422
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityErrorObject.errors[key] = errorsObject[key]
    }
    next(entityErrorObject)
  }
}
