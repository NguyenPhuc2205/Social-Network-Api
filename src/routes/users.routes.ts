/**
 * @module routes/users
 */
import { Router } from 'express'
import {
  verifyEmailController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
  getMeController,
  updateMeController,
  getUserProfileController,
  followUserController,
  unfollowUserController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  loginValidator,
  accessTokenValidator,
  registerValidator,
  refreshTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  verifyForgotPasswordValidator,
  resetPasswordValidator,
  verifiedUserValidator,
  updateMeValidator,
  followedUserValidator,
  unfollowUserValidator
} from '~/middlewares/users.middlewares'
import { UnfollowRequestParams, UpdateMeRequestBody } from '~/models/requests/Users.requests'
import { wrapAsyncRequestHandler } from '~/utils/handler'

const usersRouter = Router()

/**
 * @description Login user
 * @route GET /users/login
 * @param {object} req.body - Login credentials
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @returns {object} User data and tokens
 */
usersRouter.post('/login', loginValidator, wrapAsyncRequestHandler(loginController))

/**
 * @description Register new user
 * @route GET /users/register
 * @param {object} req.body - Registration data
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @param {string} req.body.confirm_password - Password confirmation
 * @param {string} req.body.date_of_birth - User's birth date (ISO8601)
 * @returns {object} Success message and verification email status
 */
usersRouter.post('/register', registerValidator, wrapAsyncRequestHandler(registerController))

/**
 * @description Logout user
 * @route GET /users/logout
 * @param {string} req.headers.authorization - Bearer access token
 * @param {string} req.body.refresh_token - Refresh token
 * @returns {object} Logout confirmation
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsyncRequestHandler(logoutController))

/**
 * @description Verify email address when user click on the link in email
 * @route GET /users/verify-email
 * @param {string} req.body.email_verify_token - Email verification token
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsyncRequestHandler(verifyEmailController))

/**
 * @description Resend verification email
 * @route GET /users/resend-verify-email
 * @param {string} req.headers.authorization - Bearer <access_token>
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsyncRequestHandler(resendVerifyEmailController))

/**
 * @description Submit email (in form) to reset password, create forgot password token and send email to user
 * @route GET /users/forgot-password
 * @param {string} req.body.email - User's email address
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsyncRequestHandler(forgotPasswordController))

/**
 * @description Verify link in email to reset password (After /forgot-password)
 * @route POST /users/verify-forgot-password
 * @param {string} req.body.forgot_password_token - Password reset token
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  wrapAsyncRequestHandler(verifyForgotPasswordController)
)

/**
 * @description Reset password
 * @route POST /users/reset-password
 * @param {string} req.body.forgot_password_token - Password reset token
 * @param {string} req.body.password - New password
 * @param {string} req.body.confirm_password - Password confirmation
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapAsyncRequestHandler(resetPasswordController))

/**
 * @description Get current user's profile
 * @route GET /users/me
 * @param {string} req.headers.authorization - Bearer access token
 */
usersRouter.get('/me', accessTokenValidator, wrapAsyncRequestHandler(getMeController))

/**
 * @description Update current user's profile
 * @route PATCH /users/me
 * @param {string} req.headers.authorization - Bearer access token
 * @param {object} req.body - Updated profile fields
 */
const filterKeys: Array<keyof UpdateMeRequestBody> = [
  'name',
  'date_of_birth',
  'bio',
  'location',
  'website',
  'username',
  'avatar',
  'cover_photo'
]
usersRouter.patch(
  '/me',
  accessTokenValidator,
  filterMiddleware<UpdateMeRequestBody>(filterKeys),
  verifiedUserValidator,
  updateMeValidator,
  wrapAsyncRequestHandler(updateMeController)
)

/**
 * @description Get user profile by username
 * @route GET /users/:username
 * @param {string} req.headers.authorization - Bearer access token
 * @param {string} req.params.username - Target user's username
 */
usersRouter.get('/:username', wrapAsyncRequestHandler(getUserProfileController))

/**
 * @descriptopn Follow user
 * @route POST /users/follow
 * @param {string} req.headers.authorization - Bearer access token
 * @param {string} req.body.followed_user_id - ID of user to follow
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followedUserValidator,
  wrapAsyncRequestHandler(followUserController)
)

/**
 * @description Unfollow user
 * @route DELETE /users/follow/:user_id
 * @param {string} req.headers.authorization - Bearer access token
 * @param {string} req.params.user_id - ID of user to unfollow
 */
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowUserValidator,
  wrapAsyncRequestHandler<UnfollowRequestParams>(unfollowUserController)
)

export default usersRouter
