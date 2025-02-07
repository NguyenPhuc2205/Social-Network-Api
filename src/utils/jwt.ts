import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'
import { config } from 'dotenv'
import { ErrorWithStatus } from '~/models/Errors'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { formatTokenMessage } from './tokenUtils'
import { TokenPayload } from '~/models/requests/Users.requests'
config()
// sign(payload, sercret/private_key, [options, function(err, token) => {}])
export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET_KEY as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | object | Buffer
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  const defaultOptions: jwt.SignOptions = {
    algorithm: 'HS256'
  }
  const finalOptions: jwt.SignOptions = { ...options, ...defaultOptions }
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, finalOptions, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({
  token,
  privateKey = process.env.JWT_SECRET_KEY as string,
  options
}: {
  token: string
  privateKey?: string
  options?: jwt.VerifyOptions
}) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, privateKey, options, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as TokenPayload)
    })
  })
}

export const tokenErrorsHandler = (error: unknown, tokenType: string) => {
  if (error instanceof NotBeforeError) {
    throw new ErrorWithStatus({
      message: formatTokenMessage(USERS_MESSAGES.TOKEN._NOT_ACTIVATED, tokenType),
      status: HTTP_STATUS.UNAUTHORIZED,
      otherInfo: {
        date: error.date
      }
    })
  } else if (error instanceof TokenExpiredError) {
    throw new ErrorWithStatus({
      message: formatTokenMessage(USERS_MESSAGES.TOKEN._EXPIRED, tokenType),
      status: HTTP_STATUS.UNAUTHORIZED,
      otherInfo: {
        expiredAt: error.expiredAt
      }
    })
  } else if (error instanceof JsonWebTokenError) {
    throw new ErrorWithStatus({
      message: `${formatTokenMessage(USERS_MESSAGES.TOKEN._INVALID, tokenType)}: ${error.message}`,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  } else {
    throw error
  }
}
