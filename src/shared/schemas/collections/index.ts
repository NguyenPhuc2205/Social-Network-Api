/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-22 22:30:00
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/shared/schemas/entities/index.ts
 * @Description   : Export all entity schemas
 */

// User and Authentication
export * from '~/shared/schemas/collections/user.schema'
export * from '~/shared/schemas/collections/user-session.schema'
export * from '~/shared/schemas/collections/user-preferences.schema'
export * from '~/shared/schemas/collections/refresh-token.schema'

// Content Management
export * from '~/shared/schemas/collections/media.schema'
export * from '~/shared/schemas/collections/post.schema'
export * from '~/shared/schemas/collections/hashtag.schema'
export * from '~/shared/schemas/collections/post-hashtag.schema'
export * from '~/shared/schemas/collections/post-category.schema'
export * from '~/shared/schemas/collections/post-post-category.schema'
export * from '~/shared/schemas/collections/trend.schema'

// Interactions
export * from '~/shared/schemas/collections/reaction.schema'
export * from '~/shared/schemas/collections/bookmark.schema'
export * from '~/shared/schemas/collections/follower.schema'
export * from '~/shared/schemas/collections/notification.schema'

// Communication
export * from '~/shared/schemas/collections/conversation.schema'
export * from '~/shared/schemas/collections/message.schema'

// Groups
export * from '~/shared/schemas/collections/group.schema'

// Authorization
export * from '~/shared/schemas/collections/role.schema'
export * from '~/shared/schemas/collections/permission.schema'
export * from '~/shared/schemas/collections/role-permision.schema'
