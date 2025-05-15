# Error Handling System

This directory contains the application's standardized error handling system, designed to provide consistent error responses across the API.

## Structure

- `app.error.ts` - Base error class that all specific error types extend from
- `client_4xx/` - Client error classes (400-499 status codes)
- `server_5xx/` - Server error classes (500-599 status codes)

## Usage

All errors extend the base `AppError` class, which standardizes error information including:

- HTTP status code
- Error message
- Message key for i18n
- Custom error code
- Metadata for additional context
- Request ID for tracing
- Operational status flag
- Timestamps

### Example

```typescript
// Throwing a specific error type
throw new NotFoundError({
  message: 'User with ID 12345 was not found',
  metadata: { userId: '12345' },
  requestId: req.id
});

// Catching and handling errors
try {
  await someOperation();
} catch (error) {
  if (error instanceof AppError) {
    // Handle application errors
    logger.error(`Application error: ${error.message}`, { error });
  } else {
    // Handle unexpected errors by wrapping them
    throw new InternalServerError({
      message: 'An unexpected error occurred',
      cause: error 
    });
  }
}
```

## Error Classes

### Client Errors (4xx)

- `BadRequestError` (400) - Invalid request syntax or parameters
- `UnauthorizedError` (401) - Authentication required but missing or invalid
- `ForbiddenError` (403) - Authenticated but not authorized for the resource
- `NotFoundError` (404) - Requested resource not found
- `MethodNotAllowedError` (405) - HTTP method not allowed for the resource
- `ConflictError` (409) - Request conflicts with current state
- `GoneError` (410) - Resource permanently removed
- `RequestTimeoutError` (408) - Request took too long to complete
- `UnsupportedMediaTypeError` (415) - Content type not supported
- `UnprocessableEntityError` (422) - Request semantically incorrect
- `ValidationError` (422) - Request data validation failed with details
- `TooEarlyError` (425) - Server unwilling to risk processing potentially replayed request
- `PreconditionRequiredError` (428) - Precondition required but missing
- `RateLimitError` (429) - Too many requests in a time period
- `UnavailableForLegalReasonsError` (451) - Legally restricted content

### Server Errors (5xx)

- `InternalServerError` (500) - Unexpected server condition
- `NotImplementedError` (501) - Functionality not implemented
- `BadGatewayError` (502) - Invalid response from upstream server
- `ServiceUnavailableError` (503) - Server temporarily unavailable
- `GatewayTimeoutError` (504) - Timeout from upstream service
- `InsufficientStorageError` (507) - Server storage quota exceeded
