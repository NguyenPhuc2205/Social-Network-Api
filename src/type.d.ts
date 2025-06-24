import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import User from '~/models/schemas/User.schema'
import { TokenPayload } from './models/requests/Users.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import { RequestSource } from '~/shared/interfaces/zod-validator.interface'

declare global {
  namespace Express {
    interface Request {
      request_id: string
      user?: User
      decoded_authorization?: TokenPayload
      decoded_refresh_token?: TokenPayload
      decoded_email_verify_token?: TokenPayload
      decoded_forgot_password_token?: TokenPayload

      validated?: Partial<RequestSource, any>
      files?: string
    }
    interface ParamsDictionary {
      user_id?: string
    }
  }
}
