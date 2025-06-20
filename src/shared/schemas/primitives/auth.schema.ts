/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-20 14:05:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 02:08:22
 * @FilePath      : /server/src/shared/schemas/primitives/auth.schema.ts
 * @Description   : Authentication-related schema validations
 */

import { z } from 'zod'

// ===========================
// EMAIL VALIDATION
// ===========================
export const EmailSchema = z.string()
  .trim()
  .email()
  .toLowerCase()
  .max(254) // RFC 5322 compliant

export const OptionalEmailSchema = EmailSchema.optional()

// ===========================
// PASSWORD VALIDATION
// ===========================
export const PasswordSchema = z.string()
  .min(8)
  .max(128) // Bcrypt hashed max length

export const StrongPasswordSchema = z.string()
  .min(8)
  .max(128)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/) // At least one lowercase, one uppercase, one digit, and one special character

export const HashedPasswordSchema = z.string().min(20).max(128)

// ===========================
// TOKENS
// ===========================
export const TokenSchema = z.string().trim().min(1)

export const JWTTokenSchema = z.string()
  .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)

export const RefreshTokenSchema = z.string().trim().min(1)

export const EmailVerifyTokenSchema = z.string().trim().min(1)

export const ForgotPasswordTokenSchema = z.string().min(1)

export const AccessTokenSchema = z.string().min(1)

// ===========================
// OTP & VERIFICATION
// ===========================
export const OTPSchema = z.string()
  .length(6)
  .regex(/^\d{6}$/)

export const VerificationCodeSchema = z.string()
  .trim()
  .min(4)
  .max(8)
  .regex(/^[A-Z0-9]+$/)

// ===========================
// LOGIN CREDENTIALS
// ===========================
export const LoginIdentifierSchema = z.string()
  .trim()
  .min(1)
  .refine((val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    return emailRegex.test(val) || usernameRegex.test(val)
  })

// ===========================
// PHONE NUMBER
// ===========================
export const PhoneNumberSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/) // International format

export const OptionalPhoneNumberSchema = PhoneNumberSchema.optional()

// ===========================
// SECURITY QUESTIONS
// ===========================
export const SecurityQuestionSchema = z.string()
  .trim()
  .min(5)
  .max(200)

export const SecurityAnswerSchema = z.string()
  .trim()
  .min(1)
  .max(100)

export const TwoFactorAuthCodeSchema = z.string()
  .length(6)
  .regex(/^\d{6}$/)
  
// ===========================
// TYPE EXPORTS
// ===========================
export type EmailType = z.infer<typeof EmailSchema>
export type PasswordType = z.infer<typeof PasswordSchema>
export type TokenType = z.infer<typeof TokenSchema>
export type OTPType = z.infer<typeof OTPSchema>
export type TwoFactorAuthCodeType = z.infer<typeof TwoFactorAuthCodeSchema>
