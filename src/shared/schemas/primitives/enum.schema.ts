/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-20 21:16:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 01:33:07
 * @FilePath      : /server/src/shared/schemas/primitives/enum.schema.ts
 * @Description   : Enum-related schema validations
 */

import { z } from 'zod'
import { AccountType, AgeRestriction, ContentType, DeleteReason, EventAttendeeStatus, GroupMemberRole, GroupPrivacyType, MediaType, NotificationType, PaymentStatus, PostAudience, PostType, ProfileType, ReactionType, ReportReason, ReportStatus, SubscriptionStatus, TokenType, UserVerifyStatus } from '~/shared/enums'

// ===========================
// ENUM SCHEMAS
// ===========================
export const AccountTypeSchema = z.nativeEnum(AccountType)

export const AgeRestrictionSchema = z.nativeEnum(AgeRestriction)

export const ContentTypeSchema = z.nativeEnum(ContentType)

export const DeleteReasonSchema = z.nativeEnum(DeleteReason)

export const EventAttendeeStatusSchema = z.nativeEnum(EventAttendeeStatus)

export const GroupMemberRoleSchema = z.nativeEnum(GroupMemberRole)

export const GroupPrivacyTypeSchema = z.nativeEnum(GroupPrivacyType)

export const MediaTypeSchema = z.nativeEnum(MediaType)

export const NotificationTypeSchema = z.nativeEnum(NotificationType)

export const PaymentStatusSchema = z.nativeEnum(PaymentStatus)

export const PostAudienceSchema = z.nativeEnum(PostAudience)

export const PostTypeSchema = z.nativeEnum(PostType)

export const ProfileTypeSchema = z.nativeEnum(ProfileType)

export const ReactionTypeSchema = z.nativeEnum(ReactionType)

export const ReportReasonSchema = z.nativeEnum(ReportReason)

export const ReportStatusSchema = z.nativeEnum(ReportStatus)

export const SubscriptionStatusSchema = z.nativeEnum(SubscriptionStatus)

export const TokenTypeSchema = z.nativeEnum(TokenType)

export const UserVerifyStatusSchema = z.nativeEnum(UserVerifyStatus)

// ===========================
// OPTIONAL ENUM SCHEMAS
// ===========================
export const OptionalDeleteReasonSchema = DeleteReasonSchema.optional()

export const OptionalAccountTypeSchema = AccountTypeSchema.optional()

export const OptionalUserVerifyStatusSchema = UserVerifyStatusSchema.optional()

export const OptionalProfileTypeSchema = ProfileTypeSchema.optional()

export const OptionalGroupPrivacyTypeSchema = GroupPrivacyTypeSchema.optional()

export const OptionalSubscriptionStatusSchema = SubscriptionStatusSchema.optional()

export const OptionalPaymentStatusSchema = PaymentStatusSchema.optional()

// ===========================
// TYPE EXPORTS
// ===========================
export type DeleteReasonType = z.infer<typeof DeleteReasonSchema>
export type AccountTypeType = z.infer<typeof AccountTypeSchema>
export type UserVerifyStatusType = z.infer<typeof UserVerifyStatusSchema>
export type ProfileTypeType = z.infer<typeof ProfileTypeSchema>
export type MediaTypeType = z.infer<typeof MediaTypeSchema>
export type PostAudienceType = z.infer<typeof PostAudienceSchema>
export type PostTypeType = z.infer<typeof PostTypeSchema>
export type ContentTypeType = z.infer<typeof ContentTypeSchema>
export type NotificationTypeType = z.infer<typeof NotificationTypeSchema>
export type ReactionTypeType = z.infer<typeof ReactionTypeSchema>
export type GroupPrivacyTypeType = z.infer<typeof GroupPrivacyTypeSchema>
export type GroupMemberRoleType = z.infer<typeof GroupMemberRoleSchema>
export type EventAttendeeStatusType = z.infer<typeof EventAttendeeStatusSchema>
export type ReportReasonType = z.infer<typeof ReportReasonSchema>
export type ReportStatusType = z.infer<typeof ReportStatusSchema>
export type SubscriptionStatusType = z.infer<typeof SubscriptionStatusSchema>
export type PaymentStatusType = z.infer<typeof PaymentStatusSchema>
export type TokenTypeType = z.infer<typeof TokenTypeSchema>
export type AgeRestrictionType = z.infer<typeof AgeRestrictionSchema>
