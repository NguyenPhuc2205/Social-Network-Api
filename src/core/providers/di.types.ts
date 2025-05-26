export const DI_TYPES = {
  
  // =====================================================================
  // CORE INFRASTRUCTURE
  // Base services that handle fundamental application needs
  // =====================================================================
  DatabaseService: Symbol.for('DatabaseService'),
  LoggerService: Symbol.for('LoggerService'),
  EmailService: Symbol.for('EmailService'),
  CacheService: Symbol.for('CacheService'),
  FileStorageService: Symbol.for('FileStorageService'),
  MessageQueueService: Symbol.for('MessageQueueService'),
  NotificationQueueService: Symbol.for('NotificationQueueService'), // Handles notification queues
  MetricsService: Symbol.for('MetricsService'), // Added for application metrics collection
  HealthCheckService: Symbol.for('HealthCheckService'), // Added for system health checks
  AuditService: Symbol.for('AuditService'), // Added for auditing system actions
  FeatureToggleService: Symbol.for('FeatureToggleService'), // Added for feature flag management

  // =====================================================================
  // DATABASE RELATED
  // Interfaces and implementations for database access
  // =====================================================================
  IDatabase: Symbol.for('IDatabase'),
  IDbConnection: Symbol.for('IDbConnection'),
  IDbTransaction: Symbol.for('IDbTransaction'),
  IQueryBuilder: Symbol.for('IQueryBuilder'),
  IMigrationService: Symbol.for('IMigrationService'), // Manages database migrations
  ISeedService: Symbol.for('ISeedService'), // Added for database seeding
  IDatabaseBackupService: Symbol.for('IDatabaseBackupService'), // Added for database backup and restore

  // =====================================================================
  // BUSINESS SERVICES
  // Core application business logic services
  // =====================================================================
  IUserService: Symbol.for('IUserService'),
  IAuthService: Symbol.for('IAuthService'),
  ILoggerService: Symbol.for('ILoggerService'),
  IPostService: Symbol.for('IPostService'),
  ICommentService: Symbol.for('ICommentService'),
  ITagService: Symbol.for('ITagService'),
  IReactionService: Symbol.for('IReactionService'),
  INotificationService: Symbol.for('INotificationService'),
  ISearchService: Symbol.for('ISearchService'),
  IPaymentService: Symbol.for('IPaymentService'), // Handles payment processing
  IReportService: Symbol.for('IReportService'), // Handles report generation
  ISubscriptionService: Symbol.for('ISubscriptionService'), // Added for subscription management
  IAnalyticsService: Symbol.for('IAnalyticsService'), // Added for analytics processing
  IRecommendationService: Symbol.for('IRecommendationService'), // Added for personalized recommendations
  IContentModerationService: Symbol.for('IContentModerationService'), // Added for content moderation

  // =====================================================================
  // REPOSITORIES
  // Data access layer components for different entities
  // =====================================================================
  IUserRepository: Symbol.for('IUserRepository'),
  IAuthRepository: Symbol.for('IAuthRepository'),
  IReactionRepository: Symbol.for('IReactionRepository'),
  ICommentRepository: Symbol.for('ICommentRepository'),
  ITagRepository: Symbol.for('ITagRepository'),
  IPostRepository: Symbol.for('IPostRepository'),
  IReactionTypeRepository: Symbol.for('IReactionTypeRepository'),
  ITagTypeRepository: Symbol.for('ITagTypeRepository'),
  INotificationRepository: Symbol.for('INotificationRepository'),
  IProfileRepository: Symbol.for('IProfileRepository'),
  IReportRepository: Symbol.for('IReportRepository'), // Handles report data access
  IPaymentRepository: Symbol.for('IPaymentRepository'), // Handles payment data access
  ISubscriptionRepository: Symbol.for('ISubscriptionRepository'), // Added for subscription data access
  IAuditLogRepository: Symbol.for('IAuditLogRepository'), // Added for audit log storage
  IRecommendationRepository: Symbol.for('IRecommendationRepository'), // Added for recommendation data

  // =====================================================================
  // UTILITY SERVICES
  // Supporting services for application functionality
  // =====================================================================
  IConfigService: Symbol.for('IConfigService'),
  ICacheService: Symbol.for('ICacheService'),
  IDateTimeService: Symbol.for('IDateTimeService'),
  IStringUtils: Symbol.for('IStringUtils'),
  ISecurityUtils: Symbol.for('ISecurityUtils'),
  IFileUtils: Symbol.for('IFileUtils'),
  IEventEmitter: Symbol.for('IEventEmitter'),
  ILoggingUtils: Symbol.for('ILoggingUtils'), // Provides logging utilities
  IValidationUtils: Symbol.for('IValidationUtils'), // Added for input validation utilities
  IEncryptionUtils: Symbol.for('IEncryptionUtils'), // Added for encryption and decryption utilities
  IRateLimiterUtils: Symbol.for('IRateLimiterUtils'), // Added for rate limiting utilities
  IFileCompressionUtils: Symbol.for('IFileCompressionUtils'), // Added for file compression utilities

  // =====================================================================
  // CONTROLLERS
  // API endpoints grouped by domain
  // =====================================================================
  UserController: Symbol.for('UserController'),
  AuthController: Symbol.for('AuthController'),
  PostController: Symbol.for('PostController'),
  CommentController: Symbol.for('CommentController'),
  TagController: Symbol.for('TagController'),
  ReactionController: Symbol.for('ReactionController'),
  SearchController: Symbol.for('SearchController'),
  FileController: Symbol.for('FileController'),
  PaymentController: Symbol.for('PaymentController'), // Manages payment-related APIs
  ReportController: Symbol.for('ReportController'), // Manages report-related APIs
  SubscriptionController: Symbol.for('SubscriptionController'), // Added for subscription-related APIs
  AnalyticsController: Symbol.for('AnalyticsController'), // Added for analytics-related APIs
  RecommendationController: Symbol.for('RecommendationController'), // Added for recommendation-related APIs
  ModerationController: Symbol.for('ModerationController'), // Added for content moderation-related APIs

  // =====================================================================
  // MIDDLEWARES
  // Request processing components
  // =====================================================================
  AuthMiddleware: Symbol.for('AuthMiddleware'),
  ValidationMiddleware: Symbol.for('ValidationMiddleware'),
  LoggingMiddleware: Symbol.for('LoggingMiddleware'),
  ErrorMiddleware: Symbol.for('ErrorMiddleware'),
  RateLimitMiddleware: Symbol.for('RateLimitMiddleware'),
  CorsMiddleware: Symbol.for('CorsMiddleware'),
  BodyParserMiddleware: Symbol.for('BodyParserMiddleware'),
  FileUploadMiddleware: Symbol.for('FileUploadMiddleware'),
  CompressionMiddleware: Symbol.for('CompressionMiddleware'), // Compresses response data
  RequestIdMiddleware: Symbol.for('RequestIdMiddleware'), // Added for tracking request IDs
  AuditMiddleware: Symbol.for('AuditMiddleware'), // Added for auditing requests
  LocalizationMiddleware: Symbol.for('LocalizationMiddleware'), // Added for handling localization
  SecurityMiddleware: Symbol.for('SecurityMiddleware'), // Added for security-related middleware

  // =====================================================================
  // EXTERNAL INTEGRATIONS
  // Third-party service connectors
  // =====================================================================
  IPaymentGateway: Symbol.for('IPaymentGateway'),
  IOAuthProvider: Symbol.for('IOAuthProvider'),
  ISmsService: Symbol.for('ISmsService'),
  IPushNotificationService: Symbol.for('IPushNotificationService'),
  IEmailProvider: Symbol.for('IEmailProvider'), // Integrates with external email providers
  ICloudStorageProvider: Symbol.for('ICloudStorageProvider'), // Added for cloud storage integration
  IThirdPartyApiService: Symbol.for('IThirdPartyApiService'), // Added for generic third-party API integration
  ITranslationService: Symbol.for('ITranslationService'), // Added for external translation services
  IAIContentService: Symbol.for('IAIContentService'), // Added for AI-generated content services
  ILoggingProvider: Symbol.for('ILoggingProvider'), // Added for external logging provider integration

  Logger: Symbol.for("Logger")
} as const;
