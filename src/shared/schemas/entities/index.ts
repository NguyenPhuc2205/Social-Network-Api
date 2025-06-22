/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/entities/index.ts
 * @Description   : Export all entity schemas
 */

// User and Authentication
export * from '~/shared/schemas/entities/user.schema'
export * from '~/shared/schemas/entities/user-session.schema'
export * from '~/shared/schemas/entities/user-preferences.schema'
export * from '~/shared/schemas/entities/refresh-token.schema'

// Content Management
export * from '~/shared/schemas/entities/media.schema'
export * from '~/shared/schemas/entities/post.schema'
export * from '~/shared/schemas/entities/hashtag.schema'
export * from '~/shared/schemas/entities/post-hashtag.schema'
export * from '~/shared/schemas/entities/post-category.schema'
export * from '~/shared/schemas/entities/post-post-category.schema'
export * from '~/shared/schemas/entities/trend.schema'

// Interactions
export * from '~/shared/schemas/entities/reaction.schema'
export * from '~/shared/schemas/entities/bookmark.schema'
export * from '~/shared/schemas/entities/follower.schema'
export * from '~/shared/schemas/entities/notification.schema'

// Communication
export * from '~/shared/schemas/entities/conversation.schema'
export * from '~/shared/schemas/entities/message.schema'

// Groups
export * from '~/shared/schemas/entities/group.schema'

// Authorization
export * from '~/shared/schemas/entities/role.schema'
export * from '~/shared/schemas/entities/permission.schema'
export * from '~/shared/schemas/entities/role-permision.schema'
