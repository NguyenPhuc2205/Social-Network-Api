/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-22 22:30:00
 * @FilePath      : /server/src/infrastructure/database/interfaces/index.ts
 * @Description   : Export all database interfaces
 */

// User and Authentication interfaces
export { IUser } from '~/infrastructure/database/interfaces/user.interface'
export { IUserSession } from '~/infrastructure/database/interfaces/user-session.interface'
export { IUserPreferences } from '~/infrastructure/database/interfaces/user-preferences.interface'
export { IRefreshToken } from '~/infrastructure/database/interfaces/refresh-token.interface'
export { IFollower } from '~/infrastructure/database/interfaces/follower.interface'

// Content-related exports
export { IMedia } from '~/infrastructure/database/interfaces/media.interface'
export { IPost } from '~/infrastructure/database/interfaces/post.interface'
export { IComment } from '~/infrastructure/database/interfaces/comment.interface'
export { ICommentReaction } from '~/infrastructure/database/interfaces/comment-reaction.interface'
export { IHashtag } from '~/infrastructure/database/interfaces/hashtag.interface'
export { IPostHashtag } from '~/infrastructure/database/interfaces/post-hashtag.interface'
export { IPostCategory } from '~/infrastructure/database/interfaces/post-category.interface'
export { IPostPostCategory } from '~/infrastructure/database/interfaces/post-post-category.interface'
export { ITrend } from '~/infrastructure/database/interfaces/trend.interface'
export { IReaction } from '~/infrastructure/database/interfaces/reaction.interface'
export { IBookmark } from '~/infrastructure/database/interfaces/bookmark.interface'
export { IPoll } from '~/infrastructure/database/interfaces/poll.interface'
export { IPollVote } from '~/infrastructure/database/interfaces/poll-vote.interface'

// Interaction-related exports
export { INotification } from '~/infrastructure/database/interfaces/notification.interface'
export { IConversation } from '~/infrastructure/database/interfaces/conversation.interface'
export { IMessage } from '~/infrastructure/database/interfaces/message.interface'

// Group-related exports
export { IGroup } from '~/infrastructure/database/interfaces/group.interface'
export { IGroupMember } from '~/infrastructure/database/interfaces/group-member.interface'
export { IGroupPost } from '~/infrastructure/database/interfaces/group-post.interface'

// Event-related exports
export { IEvent } from '~/infrastructure/database/interfaces/event.interface'
export { IEventAttendee } from '~/infrastructure/database/interfaces/event-attendee.interface'

// Role-related exports
export { IRole } from '~/infrastructure/database/interfaces/role.interface'
export { IPermission } from '~/infrastructure/database/interfaces/permission.interface'
export { IRolePermission } from '~/infrastructure/database/interfaces/role-permission.interface'

// Business-related exports
export { IAccountSubscription } from '~/infrastructure/database/interfaces/account-subscription.interface'
export { IPayment } from '~/infrastructure/database/interfaces/payment.interface'

// Moderation-related exports
export { IReport } from '~/infrastructure/database/interfaces/report.interface'
export { ICommentReport } from '~/infrastructure/database/interfaces/comment-report.interface'
