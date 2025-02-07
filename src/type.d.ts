import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import User from '~/models/schemas/User.schema'
import { TokenPayload } from './models/requests/Users.requests'
import { ParamsDictionary } from 'express-serve-static-core'
//Extend interface Request
declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
  }
  interface ParamsDictionary {
    user_id?: string
  }
}
