/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-04 00:25:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 01:05:13
 * @FilePath      : /server/src/shared/enums/token-types.ts
 * @Description   : Token types used for authentication and authorization
 */

/**
 * Enumeration of token types used throughout the authentication system
 * 
 * @enum {number}
 */
export enum TokenType {
  /** Token used for API access authorization, can save in localStorage, cookie,... */
  AccessToken,
  
  /** Token used to obtain new access tokens, store in 'RefreshToken' collection */
  RefreshToken,
  
  /** Token used in password reset flows */
  ForgotPasswordToken,
  
  /** Token used for email verification process */
  EmailVerifyToken
}
