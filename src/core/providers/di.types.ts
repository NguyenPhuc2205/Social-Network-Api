import { IDatabaseConnection } from '~/infrastructure/database/database.interface';
import { IOAuthConfig } from './../../configs/oauth/oauth.config';
/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-02 15:49:41
 * @FilePath      : /server/src/core/providers/di.types.ts
 * @Description   : Dependency Injection Types for InversifyJS
 */

export const DI_TYPES = Object.freeze({
  /**
   * CORE INFRASTRUCTURE
   * Base services that handle fundamental application needs
   */
  IApiResponse: Symbol.for('IApiResponse'), // Standardizes API responses
  IDatabaseService: Symbol.for('IDatabaseService'), // Manages MongoDB connections and operations
  IWinstonLoggerService: Symbol.for('IWinstonLogger'), // Logging service using Winston
  II18nService: Symbol.for('II18nService'), // Internationalization and localization
  IEmailService: Symbol.for('IEmailService'), // Handles email sending
  ICacheService: Symbol.for('ICacheService'), // Caching service (e.g., Redis or in-memory)
  IFileStorageService: Symbol.for('IFileStorageService'), // Manages file storage (e.g., S3, local)
  IMessageQueueService: Symbol.for('IMessageQueueService'), // Message queue for async tasks
  INotificationQueueService: Symbol.for('INotificationQueueService'), // Queue for notifications
  IMetricsService: Symbol.for('IMetricsService'), // Collects application metrics
  IHealthCheckService: Symbol.for('IHealthCheckService'), // Monitors system health
  IAuditService: Symbol.for('IAuditService'), // Audits system actions
  IFeatureToggleService: Symbol.for('IFeatureToggleService'), // Manages feature flags
  IGeoService: Symbol.for('IGeoService'), // Handles GeoJSON operations (e.g., location queries)

  /**
   * CONFIGURATION
   * Configuration management for the application (global settings)
   */
  IConfigService: Symbol.for('IConfigService'), // Manages application configuration
  IAppConfig: Symbol.for('IAppConfig'), // Application configuration interface
  IAuthConfig: Symbol.for('IAuthConfig'), // Authentication configuration interface
  IDatabaseConfig: Symbol.for('IDatabaseConfig'), // Database service configuration interface
  IEmailConfig: Symbol.for('IEmailConfig'), // Email service configuration interface
  ICloudinaryConfig: Symbol.for('ICloudinaryConfig'), // Cloudinary service configuration interface
  IOAuthConfig: Symbol.for('IOAuthConfig'), // OAuth service configuration interface
  IRedisCacheConfig: Symbol.for('IRedisCacheConfig'), // Redis cache service configuration interface
  IFileStorageConfig: Symbol.for('IFileStorageConfig'), // File storage configuration interface
  IMessageQueueConfig: Symbol.for('IMessageQueueConfig'), // Message queue configuration interface

  /**
   * DATABASE RELATED
   * Interfaces for database access and management
   */
  IDatabaseConnection: Symbol.for('IDatabaseConnection'), // Database connection management
  IDatabase: Symbol.for('IDatabase'), // Database interface
  IDbConnection: Symbol.for('IDbConnection'), // Database connection management
  IDbTransaction: Symbol.for('IDbTransaction'), // Transaction handling
  IQueryBuilder: Symbol.for('IQueryBuilder'), // Builds database queries
  IMigrationService: Symbol.for('IMigrationService'), // Manages database migrations
  ISeedService: Symbol.for('ISeedService'), // Seeds database with initial data
  IDatabaseBackupService: Symbol.for('IDatabaseBackupService'), // Handles database backups

  /**
   * BUSINESS SERVICES
   * Core business logic for database entities
   */
  IUserService: Symbol.for('IUserService'), // Manages User operations
  IAuthService: Symbol.for('IAuthService'), // Handles authentication and authorization
  ITweetService: Symbol.for('ITweetService'), // Manages Tweet (Post) operations
  IPostService: Symbol.for('IPostService'), // Manages Post operations
  IMediaService: Symbol.for('IMediaService'), // Manages Media operations
  ICommentService: Symbol.for('ICommentService'), // Manages Comment operations
  IHashtagService: Symbol.for('IHashtagService'), // Manages Hashtag operations
  ITweetHashtagService: Symbol.for('ITweetHashtagService'), // Manages Tweet-Hashtag relationships
  ITrendService: Symbol.for('ITrendService'), // Manages Trend operations
  IReactionService: Symbol.for('IReactionService'), // Manages Reaction operations
  IBookmarkService: Symbol.for('IBookmarkService'), // Manages Bookmark operations
  IFollowerService: Symbol.for('IFollowerService'), // Manages Follower operations
  INotificationService: Symbol.for('INotificationService'), // Manages Notification operations
  IConversationService: Symbol.for('IConversationService'), // Manages Conversation operations
  IMessageService: Symbol.for('IMessageService'), // Manages Message operations
  IGroupService: Symbol.for('IGroupService'), // Manages Group operations
  IReportService: Symbol.for('IReportService'), // Manages Report operations
  IAccountSubscriptionService: Symbol.for('IAccountSubscriptionService'), // Manages AccountSubscription operations
  IPaymentService: Symbol.for('IPaymentService'), // Manages Payment operations
  IRoleService: Symbol.for('IRoleService'), // Manages Role operations
  IPermissionService: Symbol.for('IPermissionService'), // Manages Permission operations
  IRolePermissionService: Symbol.for('IRolePermissionService'), // Manages Role-Permission relationships
  IUserSessionService: Symbol.for('IUserSessionService'), // Manages UserSession operations
  IUserPreferencesService: Symbol.for('IUserPreferencesService'), // Manages UserPreferences operations
  IRefreshTokenService: Symbol.for('IRefreshTokenService'), // Manages RefreshToken operations
  ITokenService: Symbol.for('ITokenService'), // Manages verification and password reset tokens

  /**
   * REPOSITORIES
   * Data access layer for database entities
   */
  IUserRepository: Symbol.for('IUserRepository'), // Data access for User
  ITweetRepository: Symbol.for('ITweetRepository'), // Data access for Tweet
  IPostRepository: Symbol.for('IPostRepository'), // Data access for Post
  IMediaRepository: Symbol.for('IMediaRepository'), // Data access for Media
  ICommentRepository: Symbol.for('ICommentRepository'), // Data access for Comment
  IHashtagRepository: Symbol.for('IHashtagRepository'), // Data access for Hashtag
  ITweetHashtagRepository: Symbol.for('ITweetHashtagRepository'), // Data access for TweetHashtag
  ITrendRepository: Symbol.for('ITrendRepository'), // Data access for Trend
  IReactionRepository: Symbol.for('IReactionRepository'), // Data access for Reaction
  IBookmarkRepository: Symbol.for('IBookmarkRepository'), // Data access for Bookmark
  IBookmarkCollectionRepository: Symbol.for('IBookmarkCollectionRepository'), // Data access for BookmarkCollection
  IFollowerRepository: Symbol.for('IFollowerRepository'), // Data access for Follower
  INotificationRepository: Symbol.for('INotificationRepository'), // Data access for Notification
  IConversationRepository: Symbol.for('IConversationRepository'), // Data access for Conversation
  IConversationMemberRepository: Symbol.for('IConversationMemberRepository'), // Data access for ConversationMember
  IMessageRepository: Symbol.for('IMessageRepository'), // Data access for Message
  IGroupRepository: Symbol.for('IGroupRepository'), // Data access for Group
  IGroupMemberRepository: Symbol.for('IGroupMemberRepository'), // Data access for GroupMember
  IReportRepository: Symbol.for('IReportRepository'), // Data access for Report
  IPostLikeRepository: Symbol.for('IPostLikeRepository'), // Data access for PostLike
  IPostCommentRepository: Symbol.for('IPostCommentRepository'), // Data access for PostComment
  IAccountSubscriptionRepository: Symbol.for('IAccountSubscriptionRepository'), // Data access for AccountSubscription
  IPaymentRepository: Symbol.for('IPaymentRepository'), // Data access for Payment
  IRoleRepository: Symbol.for('IRoleRepository'), // Data access for Role
  IPermissionRepository: Symbol.for('IPermissionRepository'), // Data access for Permission
  IRolePermissionRepository: Symbol.for('IRolePermissionRepository'), // Data access for RolePermission
  IUserSessionRepository: Symbol.for('IUserSessionRepository'), // Data access for UserSession
  IUserPreferencesRepository: Symbol.for('IUserPreferencesRepository'), // Data access for UserPreferences
  IRefreshTokenRepository: Symbol.for('IRefreshTokenRepository'), // Data access for RefreshToken

  /**
   * UTILITY SERVICES
   * Supporting services for application functionality
   */
  IDateTimeService: Symbol.for('IDateTimeService'), // Handles date and time operations
  IStringUtils: Symbol.for('IStringUtils'), // String manipulation utilities
  ISecurityUtils: Symbol.for('ISecurityUtils'), // Security-related utilities (e.g., hashing)
  IFileUtils: Symbol.for('IFileUtils'), // File handling utilities
  IEventEmitter: Symbol.for('IEventEmitter'), // Event emission and handling
  IValidationUtils: Symbol.for('IValidationUtils'), // Input validation utilities
  IEncryptionUtils: Symbol.for('IEncryptionUtils'), // Encryption and decryption utilities
  IRateLimiterUtils: Symbol.for('IRateLimiterUtils'), // Rate limiting utilities
  IFileCompressionUtils: Symbol.for('IFileCompressionUtils'), // File compression utilities

  /**
   * CONTROLLERS
   * API endpoints for database entities
   */
  IUserController: Symbol.for('IUserController'), // Handles User APIs
  IAuthController: Symbol.for('IAuthController'), // Handles authentication APIs
  ITweetController: Symbol.for('ITweetController'), // Handles Tweet APIs
  IPostController: Symbol.for('IPostController'), // Handles Post APIs
  IMediaController: Symbol.for('IMediaController'), // Handles Media APIs
  ICommentController: Symbol.for('ICommentController'), // Handles Comment APIs
  IHashtagController: Symbol.for('IHashtagController'), // Handles Hashtag APIs
  ITweetHashtagController: Symbol.for('ITweetHashtagController'), // Handles TweetHashtag APIs
  ITrendController: Symbol.for('ITrendController'), // Handles Trend APIs
  IReactionController: Symbol.for('IReactionController'), // Handles Reaction APIs
  IBookmarkController: Symbol.for('IBookmarkController'), // Handles Bookmark APIs
  IFollowerController: Symbol.for('IFollowerController'), // Handles Follower APIs
  INotificationController: Symbol.for('INotificationController'), // Handles Notification APIs
  IConversationController: Symbol.for('IConversationController'), // Handles Conversation APIs
  IMessageController: Symbol.for('IMessageController'), // Handles Message APIs
  IGroupController: Symbol.for('IGroupController'), // Handles Group APIs
  IReportController: Symbol.for('IReportController'), // Handles Report APIs
  IAccountSubscriptionController: Symbol.for('IAccountSubscriptionController'), // Handles AccountSubscription APIs
  IPaymentController: Symbol.for('IPaymentController'), // Handles Payment APIs
  IRoleController: Symbol.for('IRoleController'), // Handles Role APIs
  IPermissionController: Symbol.for('IPermissionController'), // Handles Permission APIs
  IRolePermissionController: Symbol.for('IRolePermissionController'), // Handles RolePermission APIs
  IUserSessionController: Symbol.for('IUserSessionController'), // Handles UserSession APIs
  IUserPreferencesController: Symbol.for('IUserPreferencesController'), // Handles UserPreferences APIs
  IRefreshTokenController: Symbol.for('IRefreshTokenController'), // Handles RefreshToken APIs

  /**
   * MIDDLEWARES
   * Request processing components
   */
  IValidationMiddleware: Symbol.for('IValidationMiddleware'), // Validates request data
  ILanguageDetectionMiddleware: Symbol.for('ILanguageDetectionMiddleware'), // Detects user language
  II18nMiddleware: Symbol.for('II18nMiddleware'), // Internationalization middleware
  IAuthMiddleware: Symbol.for('IAuthMiddleware'), // Authenticates requests
  ILoggingMiddleware: Symbol.for('ILoggingMiddleware'), // Logs requests
  IErrorHandlerMiddleware: Symbol.for('IErrorHandlerMiddleware'), // Handles errors
  IRateLimitMiddleware: Symbol.for('IRateLimitMiddleware'), // Limits request rates
  ICorsMiddleware: Symbol.for('ICorsMiddleware'), // Handles CORS
  IBodyParserMiddleware: Symbol.for('IBodyParserMiddleware'), // Parses request bodies
  IFileUploadMiddleware: Symbol.for('IFileUploadMiddleware'), // Handles file uploads
  ICompressionMiddleware: Symbol.for('ICompressionMiddleware'), // Compresses responses
  IRequestIdMiddleware: Symbol.for('IRequestIdMiddleware'), // Assigns request IDs
  IAuditMiddleware: Symbol.for('IAuditMiddleware'), // Audits requests
  ILocalizationMiddleware: Symbol.for('ILocalizationMiddleware'), // Handles localization
  ISecurityMiddleware: Symbol.for('ISecurityMiddleware'), // Enhances request security

  /**
   * EXTERNAL INTEGRATIONS
   * Third-party service connectors
   */
  IPaymentGateway: Symbol.for('IPaymentGateway'), // Integrates with payment providers
  IOAuthProvider: Symbol.for('IOAuthProvider'), // Handles OAuth authentication
  ISmsService: Symbol.for('ISmsService'), // Sends SMS notifications
  IPushNotificationService: Symbol.for('IPushNotificationService'), // Sends push notifications
  IEmailProvider: Symbol.for('IEmailProvider'), // Integrates with email providers
  ICloudStorageProvider: Symbol.for('ICloudStorageProvider'), // Integrates with cloud storage
  ITranslationService: Symbol.for('ITranslationService'), // Integrates with translation services
} as const)
