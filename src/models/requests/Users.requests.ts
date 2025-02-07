import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import core, { ParamsDictionary } from 'express-serve-static-core'

export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirmPassword: string
  date_of_birth: string
}

export interface LoginRequestBody {
  email: string
  password: string
}

export interface VerifyEmailRequestBody {
  email_verify_token: string
}

export interface ForgotPasswordRequestBody {
  email: string
}

export interface VerifyForgotPasswordRequestBody {
  forgot_password_token: string
}

export interface ResetPasswordRequestBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface UpdateMeRequestBody {
  name?: string
  date_of_birth?: string //Client send ISOString to server
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface FollowRequestBody {
  followed_user_id: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify_status?: UserVerifyStatus
}

export interface GetProfileRequestParams {
  username: string
}

export interface UnfollowRequestParams extends ParamsDictionary {
  user_id: string
}
