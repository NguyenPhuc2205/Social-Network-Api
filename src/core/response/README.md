# API Response System

<p align="center">
  <img src="https://img.icons8.com/color/96/000000/api-settings.png" alt="API Response System" width="96" height="96"/>
</p>

A comprehensive API response system that provides standardized, consistent response formatting across all API endpoints.

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Key Components](#-key-components)
- [Response Format](#-response-format)
- [Usage Examples](#-usage-examples)
- [Response Types](#-response-types)
- [Best Practices](#-best-practices)
- [Integration with i18n](#-integration-with-i18n)
- [Integration with Error Handling](#-integration-with-error-handling)
- [Extending the System](#-extending-the-system)

## 🔭 Overview

The API response system ensures that all endpoints return data in a consistent format, improving the developer experience and making the API more predictable. It provides:

- Standardized success and error response formats
- Support for internationalization (i18n) of messages
- Metadata for pagination and filtering
- Structured error details
- Request tracing with unique request IDs
- Integration with dependency injection system

## 🏗️ Architecture

The API response system is built around the `ApiResponse` class and supporting interfaces:

- **ApiResponse**: Core class for creating standardized responses
- **IApiResponseOptions**: Interface defining the response structure
- **IApiResponseMetadata**: Interface for pagination and filtering metadata
- **IApiErrorDetails**: Interface for structured error information

The system is integrated with the dependency injection container to allow for easy access throughout the application.

## 🧩 Key Components

### IApiResponseMetadata Interface

Provides metadata for responses, particularly useful for paginated lists:

```typescript
export interface IApiResponseMetadata {
  page?: number
  limit?: number
  total?: number
  totalPage?: number
  [key: string]: any
}
```

### IApiErrorDetails Interface

Provides detailed information about validation or processing errors:

```typescript
export interface IApiErrorDetails {
  message: string
  code?: string
  field?: string
  [key: string]: any
}
```

### IApiResponseOptions Interface

Defines the complete structure of an API response:

```typescript
export interface IApiResponseOptions<T> {
  status: 'success' | 'error'
  translationKey: TranslationKeys
  message: string
  data?: T
  code?: string
  statusCode?: number
  metadata?: IApiResponseMetadata
  errors?: Record<string, IApiErrorDetails>
  requestId?: string
  timestamp?: string
}
```

### ApiResponse Class

The main class for creating standardized API responses:

- Factory methods for success and error responses
- JSON serialization for consistent output
- Integration with i18n for translated messages
- HTTP status code management

## 🔄 Response Format

### Success Response Format

```json
{
  "status": "success",
  "message": "Successfully retrieved user data",
  "data": {
    "id": "123",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "metadata": {
    "timestamp": "2025-05-22T10:30:00Z"
  },
  "requestId": "req-uuid-1234"
}
```

### Error Response Format

```json
{
  "status": "error",
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": {
      "message": "Email address is invalid",
      "code": "INVALID_FORMAT",
      "field": "email"
    },
    "password": {
      "message": "Password must be at least 8 characters",
      "code": "INVALID_LENGTH",
      "field": "password"
    }
  },
  "metadata": {
    "timestamp": "2025-05-22T10:30:00Z"
  },
  "requestId": "req-uuid-1234"
}
```

### Paginated Response Format

```json
{
  "status": "success",
  "message": "Successfully retrieved users",
  "data": [
    { "id": "123", "username": "john_doe" },
    { "id": "124", "username": "jane_doe" }
  ],
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPage": 5,
    "timestamp": "2025-05-22T10:30:00Z"
  },
  "requestId": "req-uuid-1234"
}
```

## 📝 Usage Examples

### Success Response

```typescript
// In a controller method
const users = await userService.findAll(page, limit);

const response = ApiResponse.success({
  translationKey: TRANSLATION_KEYS.USERS.RETRIEVED_SUCCESSFULLY,
  message: 'Users retrieved successfully', // Translated message
  data: users.data,
  metadata: {
    page: users.page,
    limit: users.limit,
    total: users.total,
    totalPage: users.totalPage
  }
});

return res.status(response.statusCode || 200).json(response.toJSON());
```

### Error Response

```typescript
// In a controller method with validation errors
const response = ApiResponse.error({
  translationKey: TRANSLATION_KEYS.VALIDATION_ERROR,
  message: 'Validation failed',
  statusCode: HTTP_STATUS.BAD_REQUEST,
  errors: {
    email: {
      message: 'Invalid email format',
      code: 'INVALID_FORMAT',
      field: 'email'
    }
  }
});

return res.status(response.statusCode || 400).json(response.toJSON());
```

### Custom Error Code

```typescript
// Business logic error with custom code
const response = ApiResponse.error({
  translationKey: TRANSLATION_KEYS.USERS.EMAIL_ALREADY_EXISTS,
  message: 'A user with this email already exists',
  statusCode: HTTP_STATUS.CONFLICT,
  code: 'EMAIL_ALREADY_EXISTS',
  metadata: { 
    suggestedAction: 'Try logging in or use password recovery'
  }
});

return res.status(response.statusCode || 409).json(response.toJSON());
```

## 🔍 Response Types

The API supports different types of responses for various scenarios:

### Success Responses

- **Resource Created**: 201 Created with resource data
- **Resource Retrieved**: 200 OK with resource data
- **Resource Updated**: 200 OK with updated resource data
- **Resource Deleted**: 204 No Content or 200 OK with confirmation
- **List Retrieved**: 200 OK with array of resources and pagination metadata

### Error Responses

- **Validation Errors**: 400 Bad Request with field-level error details
- **Authentication Errors**: 401 Unauthorized with authentication requirements
- **Authorization Errors**: 403 Forbidden with permission details
- **Not Found Errors**: 404 Not Found with resource identifier
- **Conflict Errors**: 409 Conflict with conflicting resource details
- **Rate Limiting Errors**: 429 Too Many Requests with retry information
- **Server Errors**: 500 Internal Server Error with error tracking ID

## ✅ Best Practices

1. **Be Consistent**: Use the ApiResponse class for all API endpoints
2. **Use Appropriate Status Codes**: Follow HTTP status code conventions
3. **Provide Helpful Messages**: Include clear error messages for troubleshooting
4. **Include Request IDs**: Add request IDs for tracing and debugging
5. **Hide Sensitive Info**: Don't include sensitive information in responses
6. **Use Structured Errors**: Provide field-level validation errors
7. **Include Timestamps**: Add timestamps to all responses for correlation
8. **Use i18n**: Support multiple languages with translation keys

## 🌐 Integration with i18n

The response system integrates with the application's i18n system:

```typescript
// In ApiResponse class
private translateMessage(translationKey: TranslationKeys, message: string): string {
  if (!this.i18nService) return message;

  const translatedMessage = this.i18nService.translate(translationKey, {
    defaultValue: message,
    ...this.metadata
  });

  return translatedMessage || message;
}
```

## 🔗 Integration with Error Handling

The response system integrates with the application's error handling system:

```typescript
// In error middleware
const errorResponse = ApiResponse.fromError(err, req.i18n);
res.status(errorResponse.statusCode).json(errorResponse.toJSON());
```

## 🔄 Extending the System

### Adding Custom Response Types

```typescript
// Add method for specific response type
ApiResponse.noContent = function(): ApiResponse<void> {
  return new ApiResponse({
    status: 'success',
    translationKey: TRANSLATION_KEYS.SUCCESS,
    message: 'Operation completed successfully',
    statusCode: HTTP_STATUS.NO_CONTENT
  });
};
```

### Adding Custom Metadata

```typescript
// Extended metadata interface
interface IExtendedMetadata extends IApiResponseMetadata {
  serverTime: string;
  apiVersion: string;
  deprecationNotice?: string;
}
```

### Customizing Response Format

```typescript
// Extend the API response class with custom formatting
class EnhancedApiResponse<T> extends ApiResponse<T> {
  toJSON(): Record<string, any> {
    const base = super.toJSON();
    return {
      ...base,
      apiVersion: process.env.API_VERSION || '1.0',
      serverTime: new Date().toISOString()
    };
  }
}
```
