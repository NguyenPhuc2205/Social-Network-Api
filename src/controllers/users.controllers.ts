import { NextFunction, Request, RequestHandler, Response } from 'express'
import core from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  FollowRequestBody,
  ForgotPasswordRequestBody,
  LoginRequestBody,
  LogoutRequestBody,
  RegisterRequestBody,
  ResetPasswordRequestBody,
  TokenPayload,
  UnfollowRequestParams,
  UpdateMeRequestBody,
  VerifyEmailRequestBody,
  VerifyForgotPasswordRequestBody
} from '~/models/requests/Users.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'

export const registerController = async (
  req: Request<core.ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  return res.status(HTTP_STATUS.CREATED).json({ message: USERS_MESSAGES.REGISTER_SUCCESS, result })
}

export const loginController = async (
  req: Request<core.ParamsDictionary, any, LoginRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User
  const userId = user._id as ObjectId
  const result = await usersService.login({
    userId: userId.toString(),
    verifyStatus: user.verify_status
  })
  return res.json({ message: USERS_MESSAGES.LOGIN_SUCCESS, result })
}

export const logoutController = async (
  req: Request<core.ParamsDictionary, any, LogoutRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.json(result)
}

export const verifyEmailController = async (
  req: Request<core.ParamsDictionary, any, VerifyEmailRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
  }
  if (user.email_verify_token === '') {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE })
  }
  const result = await usersService.verifyEmail(user._id.toString())
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  //Get decoded_authorization in req
  const { user_id: userId } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(userId) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
  }
  if (user.email_verify_token === '') {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE })
  }
  const result = await usersService.resendVerifyEmail(user._id.toString())
  return res.json(result)
}

export const forgotPasswordController = async (
  req: Request<core.ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id, verify_status } = req.user as User
  const result = await usersService.forgotPassword({
    userId: _id.toString(),
    verifyStatus: verify_status
  })
  return res.status(HTTP_STATUS.OK).json(result)
}

export const verifyForgotPasswordController = async (
  req: Request<core.ParamsDictionary, any, VerifyForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<core.ParamsDictionary, any, ResetPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await usersService.resetPassword(user_id, password)
  return res.status(HTTP_STATUS.OK).json(result)
}

export const getMeController = async (
  req: Request<core.ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { user_id: userId } = req.decoded_authorization as TokenPayload
  const user = await usersService.getMe(userId)
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result: user
  })
}

export const updateMeController = async (
  req: Request<core.ParamsDictionary, any, UpdateMeRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id: userId } = req.decoded_authorization as TokenPayload
  const { body } = req
  const user = await usersService.updateMe(userId, body)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result: user
  })
}

export const getUserProfileController = async (
  req: Request<core.ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params
  const user = await usersService.getUserProfile(username)
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
  }
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.GET_USER_PROFILE_SUCCESS,
    result: user
  })
}

export const followUserController = async (
  req: Request<core.ParamsDictionary, any, FollowRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.body
  const result = await usersService.followUser(user_id, followed_user_id)
  return res.status(HTTP_STATUS.OK).json({
    result
  })
}

export const unfollowUserController: RequestHandler<UnfollowRequestParams> = async (
  req: Request<UnfollowRequestParams>,
  res: Response,
  next: NextFunction
) => {
  const { user_id: userId } = req.decoded_authorization as TokenPayload
  const { user_id: followedUserId } = req.params
  const result = await usersService.unfollowUser(userId, followedUserId)
  return res.status(HTTP_STATUS.OK).json({})
}
