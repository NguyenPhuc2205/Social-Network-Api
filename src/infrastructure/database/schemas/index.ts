/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-08 14:30:00
 * @FilePath      : /server/src/infrastructure/database/schemas/index.ts
 * @Description   : Export all database schemas
 */

// User-related exports
export {
  IUserSchema,
  IUserSessionSchema,
  IUserPreferencesSchema,
  IRefreshTokenSchema,
  IFollowerSchema,
} from '~/infrastructure/database/schemas/user-related.schema'

// Content-related exports
export {
  IMediaSchema,
  IPostSchema,
  IHashtagSchema,
  IPostHashtagSchema,
  IPostCategorySchema,
  IPostPostCategorySchema,
  ITrendSchema,
  IReactionSchema,
  IBookmarkSchema,
  IPollSchema,
  IPollVoteSchema
} from '~/infrastructure/database/schemas/content-related.schema'

// Interaction-related exports
export {
  INotificationSchema,
  IConversationSchema,
  IMessageSchema,
} from '~/infrastructure/database/schemas/interaction-related.schema'

// Group-related exports
export {
  IGroupSchema,
  IGroupMemberSchema,
  IGroupPostSchema
} from '~/infrastructure/database/schemas/group-related.schema'

// Event-related exports
export {
  IEventSchema,
  IEventAttendeeSchema
} from '~/infrastructure/database/schemas/event-related.schema'

// Role-related exports
export {
  IRoleSchema,
  IPermissionSchema,
  IRolePermissionSchema
} from '~/infrastructure/database/schemas/role-related.schema'

// Business-related exports
export {
  IAccountSubscriptionSchema,
  IPaymentSchema,
} from '~/infrastructure/database/schemas/payment-related.schema'

// Moderation-related exports
export {
  IReportSchema
} from '~/infrastructure/database/schemas/report-related.schema'
