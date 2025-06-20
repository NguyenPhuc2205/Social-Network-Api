/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-20 14:25:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-20 21:49:07
 * @FilePath      : /server/src/shared/schemas/primitives/dates.schema.ts
 * @Description   : Date and time-related schema validations
 */

import { z } from 'zod'

// ===========================
// DATE & TIME
// ===========================
export const DateSchema = z.date()

export const OptionalDateSchema = DateSchema.optional()

export const NullableDateSchema = DateSchema.nullable()

export const OptionalNullableDateSchema = DateSchema.nullable().optional()

// ===========================
// SPECIFIC DATE FIELDS
// ===========================
export const ReadAtSchema = z.date()

export const EditedAtSchema = z.date()

export const LastActivitySchema = z.date()

export const LastMessageTimeSchema = z.date()

export const JoinedAtSchema = z.date()

export const PinnedAtSchema = z.date()

export const CheckInAtSchema = z.date()

export const ReviewedAtSchema = z.date()

export const ProcessedAtSchema = z.date()

export const FailedAtSchema = z.date()

export const RefundedAtSchema = z.date()

export const CancelledAtSchema = z.date()

export const PaymentDateSchema = z.date()

// ===========================
// USER SPECIFIC DATES
// ===========================
export const DateOfBirthSchema = z.date()

// ===========================
// EVENT SPECIFIC DATES
// ===========================
export const StartTimeSchema = z.date()

export const EndTimeSchema = z.date()

export const PollEndTimeSchema = z.date()

// ===========================
// SUBSCRIPTION & BILLING DATES
// ===========================
export const StartDateSchema = z.date()

export const EndDateSchema = z.date()

export const NextBillingDateSchema = z.date()

// ===========================
// TOKEN EXPIRY DATES
// ===========================
export const ExpiresAtSchema = z.date()

export const TokenExpiresAtSchema = z.date()

// ===========================
// TYPE EXPORTS
// ===========================
export type DateType = z.infer<typeof DateSchema>
export type DateOfBirthType = z.infer<typeof DateOfBirthSchema>
export type StartTimeType = z.infer<typeof StartTimeSchema>
export type EndTimeType = z.infer<typeof EndTimeSchema>
