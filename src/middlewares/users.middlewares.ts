import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enum'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/Users.requests'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { comparePassword } from '~/utils/bcrypt'
import { tokenErrorsHandler, verifyToken } from '~/utils/jwt'
import { formatTokenMessage } from '~/utils/tokenUtils'
import { validate } from '~/utils/validation'

const nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED,
    bail: true
  },
  isString: {
    errorMessage: USERS_MESSAGES.NAME_MUST_BE_STRING,
    bail: true
  },
  trim: true,
  isLength: {
    errorMessage: USERS_MESSAGES.NAME_LENGTH,
    options: {
      min: 2,
      max: 100
    }
  }
}

const emailSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED,
    bail: true
  },
  isString: {
    errorMessage: USERS_MESSAGES.EMAIL_MUST_BE_STRING,
    bail: true
  },
  trim: true,
  isEmail: {
    errorMessage: USERS_MESSAGES.EMAIL_INVALID,
    bail: true
  }
}

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED,
    bail: true
  },
  isString: {
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING,
    bail: true
  },
  trim: true,
  isLength: {
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH,
    options: {
      min: 6,
      max: 50
    },
    bail: true
  },
  matches: {
    errorMessage: USERS_MESSAGES.PASSWORD_COMPLEXITY,
    options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
  }
}

const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_CONFIRMATION_IS_REQUIRED,
    bail: true
  },
  isString: {
    errorMessage: USERS_MESSAGES.PASSWORD_CONFIRMATION_MUST_BE_STRING,
    bail: true
  },
  trim: true,
  isLength: {
    errorMessage: USERS_MESSAGES.PASSWORD_CONFIRMATION_LENGTH,
    options: {
      min: 6,
      max: 50
    },
    bail: true
  },
  custom: {
    options: (value, { req }) => {
      if (req.body.password !== value) {
        throw new Error(USERS_MESSAGES.PASSWORD_CONFIRMATION_MISMATCH)
      }
      return true
    }
  }
}

const dateOfBirthSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_IS_REQUIRED,
    bail: true
  },
  isISO8601: {
    errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601,
    options: {
      strict: true,
      strictSeparator: true
    }
  }
}

const bioSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGES.BIO_MUST_BE_STRING,
    bail: true
  },
  trim: true,
  isLength: {
    options: {
      min: 2,
      max: 200
    },
    errorMessage: USERS_MESSAGES.BIO_LENGTH
  }
}

const locationSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGES.BIO_MUST_BE_STRING,
    bail: true
  },
  trim: true,
  isLength: {
    options: {
      min: 2,
      max: 200
    },
    errorMessage: USERS_MESSAGES.BIO_LENGTH
  }
}

const websiteSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGES.WEBSITE_MUST_BE_STRING,
    bail: true
  },
  trim: true,
  isLength: {
    options: {
      min: 2,
      max: 200
    },
    errorMessage: USERS_MESSAGES.WEBSITE_LENGTH
  }
}

const usernameSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGES.USERNAME_MUST_BE_STRING,
    bail: true
  },
  trim: true,
  isLength: {
    options: {
      min: 2,
      max: 100
    },
    errorMessage: USERS_MESSAGES.USERNAME_LENGTH
  }
}

const avatarSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGES.AVATAR_MUST_BE_STRING,
    bail: true
  },
  trim: true,
  isLength: {
    options: {
      min: 2,
      max: 200
    },
    errorMessage: USERS_MESSAGES.AVATAR_LENGTH
  }
}

const coverSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGES.COVER_MUST_BE_STRING,
    bail: true
  },
  trim: true,
  isLength: {
    options: {
      min: 2,
      max: 200
    },
    errorMessage: USERS_MESSAGES.COVER_LENGTH
  }
}

const userIdSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_ID_IS_REQUIRED,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      if (!ObjectId.isValid(value)) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.INVALID_USER_ID,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
      const followedUser = await databaseService.users.findOne({
        _id: new ObjectId(value)
      })
      if (!followedUser) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
    }
  }
}

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ email: value })
            if (!user) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.EMAIL_IS_NOT_REGISTERED,
                status: HTTP_STATUS.CONFLICT
              })
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        ...passwordSchema,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ email: req.body.email })
            if (!user) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.EMAIL_IS_NOT_REGISTERED,
                status: HTTP_STATUS.CONFLICT
              })
            }
            const isMatchedPassword = await comparePassword(value, user.password)
            if (!isMatchedPassword) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.PASSWORD_IS_INCORRECT,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      email: {
        ...emailSchema,
        custom: {
          options: async (value) => {
            const isExistedEmail = await usersService.checkEmailExist(value)
            if (isExistedEmail) {
              throw new ErrorWithStatus({ message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS, status: HTTP_STATUS.CONFLICT })
            }
            return true
          }
        }
      },
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
      date_of_birth: dateOfBirthSchema
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const tokenType = 'Access token'
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.AUTHORIZATION_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            if (!value.startsWith('Bearer ')) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.AUTHORIZAION_MUST_START_WITH_BEARER,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const accessToken = value.split(' ')[1].trim()
            if (!accessToken) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_MISSING,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decodedAuthorization: TokenPayload = await verifyToken({
                token: accessToken,
                privateKey: process.env.JWT_SECRET_ACCESS_TOKEN_KEY,
                options: {}
              })
              ;(req as Request).decoded_authorization = decodedAuthorization
              return true
            } catch (error) {
              tokenErrorsHandler(error, tokenType)
            }
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const tokenType: string = 'Refresh token'
            if (!value) {
              throw new ErrorWithStatus({
                message: formatTokenMessage(USERS_MESSAGES.TOKEN._IS_REQUIRED, tokenType),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const [decodedRefreshToken, refreshToken] = await Promise.all([
                verifyToken({
                  token: value,
                  privateKey: process.env.JWT_SECRET_REFRESH_TOKEN_KEY as string,
                  options: {}
                }),
                databaseService.refreshTokens.findOne({ token: value })
              ])
              if (!refreshToken) {
                throw new ErrorWithStatus({
                  message: formatTokenMessage(USERS_MESSAGES.TOKEN._USED_TOKEN_OR_NOT_EXIST, tokenType),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              req.decoded_refresh_token = decodedRefreshToken
            } catch (error) {
              tokenErrorsHandler(error, tokenType)
            }
          }
        }
      }
    },
    ['body']
  )
)

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const tokenType: string = 'Email verify token'
            if (!value) {
              throw new ErrorWithStatus({
                message: formatTokenMessage(USERS_MESSAGES.TOKEN._IS_REQUIRED, tokenType),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decodedEmailVerifyToken = await verifyToken({
                token: value,
                privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN_KEY as string
              })
              ;(req as Request).decoded_email_verify_token = decodedEmailVerifyToken
            } catch (error) {
              tokenErrorsHandler(error, tokenType)
            }
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ email: value })
            if (user === null) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const tokenType = 'Forgot password token'
            if (!value) {
              throw new ErrorWithStatus({
                message: formatTokenMessage(USERS_MESSAGES.TOKEN._IS_REQUIRED, tokenType),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decodedForgotPasswordToken = await verifyToken({
                token: value,
                privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN_KEY as string
              })
              const user = await databaseService.users.findOne({
                _id: new ObjectId(decodedForgotPasswordToken.user_id)
              })
              if (user === null) {
                throw new ErrorWithStatus({
                  message: formatTokenMessage(USERS_MESSAGES.TOKEN._USED_TOKEN_OR_NOT_EXIST, tokenType),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              if (user.forgot_password_token && user.forgot_password_token !== value) {
                throw new ErrorWithStatus({
                  message: formatTokenMessage(USERS_MESSAGES.TOKEN._INVALID, tokenType),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              return true
            } catch (error) {
              tokenErrorsHandler(error, tokenType)
            }
          }
        }
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema({
    forgot_password_token: {
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const tokenType = 'Forgor password token'
          if (!value) {
            throw new ErrorWithStatus({
              message: formatTokenMessage(USERS_MESSAGES.TOKEN._IS_REQUIRED, tokenType),
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          try {
            const decodedForgotPasswordToken = await verifyToken({
              token: value,
              privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN_KEY as string
            })
            ;(req as Request).decoded_forgot_password_token = decodedForgotPasswordToken
            return true
          } catch (error) {
            tokenErrorsHandler(error, tokenType)
          }
        }
      }
    },
    password: passwordSchema,
    confirm_password: confirmPasswordSchema
  })
)

//Based on Authorization and decoded authorization
export const verifiedUserValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { verify_status: verifyStatus } = req.decoded_authorization as TokenPayload
  if (verifyStatus !== UserVerifyStatus.Verified) {
    next(
      new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }
  next()
}

export const updateMeValidator = validate(
  checkSchema({
    name: {
      ...nameSchema,
      optional: true,
      notEmpty: undefined
    },
    email: {
      ...emailSchema,
      optional: true,
      notEmpty: undefined
    },
    date_of_birth: {
      ...dateOfBirthSchema,
      optional: true,
      notEmpty: undefined
    },
    bio: {
      ...bioSchema,
      optional: true,
      notEmpty: undefined
    },
    location: {
      ...locationSchema,
      optional: true,
      notEmpty: undefined
    },
    website: {
      ...websiteSchema,
      optional: true,
      notEmpty: undefined
    },
    username: {
      ...usernameSchema,
      optional: true,
      notEmpty: undefined
    },
    avatar: {
      ...avatarSchema,
      optional: true,
      notEmpty: undefined
    },
    cover: {
      ...coverSchema,
      optional: true,
      notEmpty: undefined
    }
  })
)

export const followedUserValidator = validate(
  checkSchema(
    {
      followed_user_id: userIdSchema
    },
    ['body']
  )
)

export const unfollowUserValidator = validate(
  checkSchema(
    {
      user_id: userIdSchema
    },
    ['body']
  )
)
