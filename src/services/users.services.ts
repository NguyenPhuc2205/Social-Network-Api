import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import User from '~/models/schemas/User.schema'
import { RegisterRequestBody, UpdateMeRequestBody } from '~/models/requests/Users.requests'
import databaseService from './database.services'
import { signToken } from '~/utils/jwt'
import { comparePassword, hashPassword } from '~/utils/bcrypt'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Follower from '~/models/schemas/Follower.schema'
config()

/**
 *
 */
class UsersService {
  // Array of some function(userId) => return Promise<string>
  /**
   *
   * @param root0
   * @param root0.userId
   * @param root0.verifyStatus
   * @param root0.signTokenFunctions
   */
  private async signUserTokens({
    userId,
    verifyStatus,
    signTokenFunctions
  }: {
    userId: string
    verifyStatus: UserVerifyStatus
    signTokenFunctions: Array<
      ({ userId, verifyStatus }: { userId: string; verifyStatus: UserVerifyStatus }) => Promise<string>
    >
  }) {
    return Promise.all(signTokenFunctions.map((func) => func({ userId, verifyStatus })))
  }
  /**
   *
   * @param root0
   * @param root0.userId
   * @param root0.verifyStatus
   */
  private signAccessToken({ userId, verifyStatus }: { userId: string; verifyStatus: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id: userId,
        token_type: TokenType.AccessToken,
        verify_status: verifyStatus
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN_KEY as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  /**
   *
   * @param root0
   * @param root0.userId
   * @param root0.verifyStatus
   */
  private signRefreshToken({ userId, verifyStatus }: { userId: string; verifyStatus: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id: userId,
        token_type: TokenType.RefreshToken,
        verify_status: verifyStatus
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN_KEY as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  /**
   *
   * @param root0
   * @param root0.userId
   * @param root0.verifyStatus
   */
  private signEmailVerifyToken({ userId, verifyStatus }: { userId: string; verifyStatus: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id: userId,
        token_type: TokenType.EmailVerifyToken,
        verify_status: verifyStatus
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN_KEY as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }
  /**
   *
   * @param root0
   * @param root0.userId
   * @param root0.verifyStatus
   */
  private signForgotPasswordToken({ userId, verifyStatus }: { userId: string; verifyStatus: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id: userId,
        token_type: TokenType.ForgotPasswordToken
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN_KEY as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    })
  }
  /**
   *
   * @param root0
   * @param root0.userId
   * @param root0.verifyStatus
   */
  async login({ userId, verifyStatus }: { userId: string; verifyStatus: UserVerifyStatus }) {
    const [accessToken, refreshToken] = await this.signUserTokens({
      userId,
      verifyStatus,
      signTokenFunctions: [this.signAccessToken, this.signRefreshToken]
    })
    // await databaseService.refreshTokens.updateOne(
    //   {
    //     user_id: new ObjectId(userId)
    //   },
    //   [
    //     {
    //       $set: {
    //         token: refreshToken,
    //         created_at: {
    //           $cond: {
    //             //Refer to value of 'created_at' field in document refresh token
    //             if: {
    //               $eq: [{ $type: '$created_at' }, 'missing']
    //             },
    //             then: '$$NOW',
    //             else: '$created_at'
    //           }
    //         }
    //       }
    //     }
    //   ],
    //   {
    //     upsert: true
    //   }
    // )
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(userId),
        token: refreshToken
      })
    )
    return {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }
  /**
   *
   * @param payload
   */
  async register(payload: RegisterRequestBody) {
    const newUser: User = new User({
      ...payload,
      date_of_birth: new Date(payload.date_of_birth),
      password: await hashPassword(payload.password)
    })
    const userId = newUser._id
    const [accessToken, refreshToken, emailVerifyToken] = await this.signUserTokens({
      userId: userId.toString(),
      verifyStatus: UserVerifyStatus.Unverified,
      signTokenFunctions: [this.signAccessToken, this.signRefreshToken, this.signEmailVerifyToken]
    })
    await databaseService.refreshTokens.insertOne(new RefreshToken({ user_id: userId, token: refreshToken }))
    newUser.email_verify_token = emailVerifyToken
    const result = await databaseService.users.insertOne(newUser)
    return {
      result,
      access_token: accessToken,
      refresh_token: refreshToken,
      email_verify_token: emailVerifyToken
    }
  }
  /**
   *
   * @param refreshToken
   */
  async logout(refreshToken: string) {
    await databaseService.refreshTokens.deleteOne({ token: refreshToken })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }
  /**
   *
   * @param userId
   */
  async verifyEmail(userId: string) {
    // Create refresh, access token + Delete email_verify_token + update verify status
    const [tokens] = await Promise.all([
      this.signUserTokens({
        userId,
        verifyStatus: UserVerifyStatus.Verified,
        signTokenFunctions: [this.signAccessToken, this.signRefreshToken]
      }),
      databaseService.users.updateOne({ _id: new ObjectId(userId) }, [
        {
          $set: {
            email_verify_token: '',
            verify_status: UserVerifyStatus.Verified,
            updated_at: '$$NOW'
          }
        }
      ])
    ])
    const [accessToken, refreshToken] = tokens
    return {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }

  /**
   *
   * @param userId
   */
  async resendVerifyEmail(userId: string) {
    // Create new Token and Sending email
    const newEmailVerifyToken = await this.signEmailVerifyToken({ userId, verifyStatus: UserVerifyStatus.Unverified })
    console.log('Sending email to verify token')

    //Update to database
    await databaseService.users.updateOne({ _id: new ObjectId(userId) }, [
      {
        $set: {
          email_verify_token: newEmailVerifyToken,
          updated_at: '$$NOW'
        }
      }
    ])
    return {
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
    }
  }
  /**
   *
   * @param root0
   * @param root0.userId
   * @param root0.verifyStatus
   */
  async forgotPassword({ userId, verifyStatus }: { userId: string; verifyStatus: UserVerifyStatus }) {
    //Create forgotPasswordToken and update it to database
    const forgotPasswordToken = await this.signForgotPasswordToken({ userId, verifyStatus })
    await databaseService.users.updateOne({ _id: new ObjectId(userId) }, [
      {
        $set: {
          forgot_password_token: forgotPasswordToken,
          updated_at: '$$NOW'
        }
      }
    ])
    return { message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD }
    //http:port//domain.com/forgot-password?token=token
  }
  /**
   *
   * @param userId
   * @param newPassword
   */
  async resetPassword(userId: string, newPassword: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          password: await hashPassword(newPassword),
          forgot_password_token: ''
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return { message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS }
  }
  /**
   *
   * @param userId
   */
  async getMe(userId: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }
  /**
   *
   * @param email
   */
  async checkEmailExist(email: string) {
    const userEmail = await databaseService.users.findOne({ email })
    return Boolean(userEmail)
  }
  /**
   *
   * @param password
   * @param hashPassword
   */
  async compareUserPassword(password: string, hashPassword: string) {
    return comparePassword(password, hashPassword)
  }
  /**
   *
   * @param userId
   * @param payload
   */
  async updateMe(userId: string, payload: UpdateMeRequestBody) {
    // update and return document
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(userId)
      },
      {
        $set: {
          ...(_payload as UpdateMeRequestBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return user
  }
  /**
   *
   * @param username
   */
  async getUserProfile(username: string) {
    const user = databaseService.users.findOne({ username })
    return user
  }
  /**
   *
   * @param userId
   * @param followedUserId
   */
  async followUser(userId: string, followedUserId: string) {
    const follower = await databaseService.followers.findOne({
      user_id: new ObjectId(userId),
      followed_user_id: new ObjectId(followedUserId)
    })
    if (follower === null) {
      await databaseService.followers.insertOne(
        new Follower({
          user_id: new ObjectId(userId),
          followed_user_id: new ObjectId(followedUserId)
        })
      )
      return {
        message: USERS_MESSAGES.FOLLOW_USER_SUCCESS
      }
    }
    return {
      message: USERS_MESSAGES.FOLLOWED_USER
    }
  }
  /**
   *
   * @param userId
   * @param followedUserId
   */
  async unfollowUser(userId: string, followedUserId: string) {
    const follower = await databaseService.followers.findOne({
      user_id: new ObjectId(userId),
      followed_user_id: new ObjectId(followedUserId)
    })
    // Not found document follower => Not following or already unfollowed
    if (follower === null) {
      return {
        message: USERS_MESSAGES.NOT_FOLLOWING_OR_ALREADY_UNFOLLOWED
      }
    }
    await databaseService.followers.deleteOne({
      _id: follower._id
    })
    return {
      message: USERS_MESSAGES.UNFOLLOW_SUCCESS
    }
  }
}
const usersService = new UsersService()
export default usersService
