# Logging System

<p align="center">
  <img src="https://img.icons8.com/color/96/000000/activity-log.png" alt="Logging System" width="96" height="96"/>
</p>

A comprehensive logging system built on Winston that provides consistent, structured logging capabilities throughout the application.

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Key Components](#-key-components)
- [Features](#-features)
- [Usage Examples](#-usage-examples)
- [Best Practices](#-best-practices)
- [Integration with Error Handling](#-integration-with-error-handling)
- [Configuration](#-configuration)
- [Extending the System](#-extending-the-system)

## 🔭 Overview

The logging system provides a structured way to record application events, errors, and performance metrics. It supports:

- Multiple log levels (error, warn, info, debug)
- Structured logging with contextual information
- Request tracking with unique IDs
- Error stack traces and metadata
- Log rotation and file management
- Environment-specific formatting (colorized for development, JSON for production)
- Integration with dependency injection system

## 🏗️ Architecture

The logging system is built on Winston, a flexible logging library for Node.js:

- **WinstonLoggerService**: Core implementation of the logging interface
- **IWinstonLoggerService**: Interface defining the logging contract
- **ILogContext & ILogParams**: Interfaces for structured logging

The system follows a singleton pattern to ensure consistent logging behavior across the application.

## 🧩 Key Components

### ILogContext Interface

Provides contextual information for each log entry:

```typescript
export interface ILogContext {
  module?: string  // Component/module generating the log
  method?: string  // Method name or HTTP method 
  route?: string   // API route or function path
  action?: string  // Specific action being performed
}
```

### ILogParams Interface

Defines parameters for log messages:

```typescript
export interface ILogParams {
  message: string
  context?: ILogContext | string | string[]
  requestId?: string
  metadata?: any
  error?: Error
}
```

### IWinstonLoggerService Interface

Defines the contract for the logger service:

```typescript
export interface IWinstonLoggerService {
  info(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any): void
  error(messageOrParams: string | ILogParams, context?: ILogContext | string | string[], requestId?: string, metadata?: any, error?: Error): void
  // Additional methods...
}
```

### WinstonLoggerService Class

Implements the logger interface with Winston:

- Configures transport mechanisms (console, file)
- Formats log entries (timestamps, colors, JSON)
- Manages log rotation and archiving
- Provides singleton instance access

## ✨ Features

- **Structured Logging**: Records logs with consistent structure for easy querying
- **Context Tracking**: Attaches module, method, route, and action to logs
- **Request Tracing**: Correlates logs across a request lifecycle with unique IDs
- **Error Handling**: Preserves error stack traces and metadata
- **Dynamic Configuration**: Supports runtime reconfiguration of log levels
- **Log Rotation**: Daily rotation of log files to manage disk space
- **Multiple Formats**: Console-friendly development logs and machine-readable production logs

## 📝 Usage Examples

### Basic Logging

```typescript
// Get logger instance
const logger = WinstonLoggerService.getInstance();

// Simple log messages
logger.info('User registration successful');
logger.error('Database connection failed');
```

### Structured Logging with Context

```typescript
// Object-based context
logger.info('User created', { 
  module: 'UserController', 
  method: 'POST', 
  route: '/api/users', 
  action: 'create' 
});

// Array-based context (module, method, route, action)
logger.info('User updated', ['UserController', 'PUT', '/api/users/123', 'update']);
```

### Request Tracing

```typescript
// Track a request through multiple components
const requestId = 'req-uuid-1234';

// In controller
logger.info('Request received', { module: 'AuthController' }, requestId);

// In service
logger.info('Validating credentials', { module: 'AuthService' }, requestId);

// In repository
logger.info('Fetching user by email', { module: 'UserRepository' }, requestId);
```

### Error Logging with Metadata

```typescript
try {
  // Some operation
} catch (error) {
  logger.error(
    'Failed to process payment', 
    { module: 'PaymentService', action: 'processPayment' },
    requestId,
    { orderId: '12345', amount: 99.99 },
    error
  );
}
```

### Using Parameter Object

```typescript
logger.info({
  message: 'Email sent to user',
  context: { module: 'NotificationService', action: 'sendEmail' },
  requestId: 'req-uuid-1234',
  metadata: { userId: '123', template: 'welcome' }
});
```

## ✅ Best Practices

1. **Be Consistent with Context**: Always provide module, method, route, and action information
2. **Use Request IDs**: Pass request IDs through all layers of the application
3. **Log Meaningful Events**: Log important business events, not just technical operations
4. **Include Relevant Metadata**: Add structured data that helps with troubleshooting
5. **Choose Appropriate Log Levels**:
   - ERROR: Application errors requiring immediate attention
   - WARN: Unexpected situations that don't break functionality
   - INFO: Important business events and normal application flow
   - DEBUG: Detailed information for troubleshooting
6. **Don't Log Sensitive Information**: Avoid logging passwords, tokens, or personal data

## 🔗 Integration with Error Handling

The logging system integrates with the application's error handling system:

1. **Error Middleware**: Automatically logs errors caught by the global error handler
2. **AppError Class**: Base error class includes logging capabilities
3. **Error Context**: Errors carry context that gets included in logs

```typescript
// In error middleware
logger.error(
  'Unhandled exception',
  { module: 'ErrorMiddleware', route: req.path, method: req.method },
  req.id,
  { userId: req.user?.id },
  err
);
```

## ⚙️ Configuration

The logger can be configured through environment variables:

```env
# Log configuration
LOG_LEVEL=info              # error, warn, info, debug
LOG_FORMAT=json             # json, pretty
LOG_FILE_ENABLED=true       # true, false
LOG_CONSOLE_ENABLED=true    # true, false
LOG_FILE_MAX_SIZE=10m       # Maximum log file size
LOG_FILE_MAX_FILES=7d       # Maximum log file retention
```

## 🔄 Extending the System

### Adding New Log Levels

```typescript
// Add custom log level method
WinstonLoggerService.prototype.audit = function(message, context) {
  this.logger.log('audit', message, { context });
};
```

### Creating Custom Transports

```typescript
// Add third-party logging service transport
const customTransport = new winston.transports.CustomService({
  // transport configuration
});

// Add to logger configuration
logger.reconfigureLogger({ 
  additionalTransports: [customTransport]
});
```

### Extending Context Information

```typescript
// Extended context interface
interface IExtendedLogContext extends ILogContext {
  tenantId?: string;
  environment?: string;
  correlationId?: string;
}
```
