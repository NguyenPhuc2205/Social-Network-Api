# Internationalization (i18n) System

![Translation](https://img.icons8.com/color/96/000000/translation.png)

A comprehensive internationalization system that enables multi-language support across the application, built on i18next.

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Configuration](#-configuration)
- [Key Components](#-key-components)
- [Locale File Organization](#-locale-file-organization)
- [Using i18n with Errors](#-using-i18n-with-errors)
- [Best Practices](#-best-practices)
- [Examples](#-examples)
- [Adding a New Language](#-adding-a-new-language)

## 🔭 Overview

The internationalization (i18n) system allows for:

- Multi-language support throughout the application
- Dynamic language switching
- Message interpolation for dynamic content
- Namespaced translations for modular organization
- Integration with error handling system
- Fallback mechanisms when translations are missing

## 🏗️ Architecture

The i18n system is built upon:

- **i18next**: Core internationalization framework
- **i18next-http-middleware**: Express middleware for language detection
- **i18next-fs-backend**: File system backend for loading translations
- **I18nService**: Application service that wraps i18next functionality

Key features:

1. **Request-based language detection**: Detect language from HTTP headers, query parameters, or cookies
2. **Global language setting**: Change language for the entire application
3. **Namespaced translations**: Organize translations by module/domain
4. **Message resolution**: Flexible fallback system when translations are missing
5. **Integration with error handling**: Translate error messages consistently

## 🛠️ Configuration

The i18n system is configured in `i18n.config.ts`:

```typescript
// Configuration highlights
export const i18nConfig = {
  supportedLanguages: ['en', 'vi', 'fr'],
  defaultLanguage: 'en',
  fallbackLanguages: ['en'],
  
  detectionOrder: [
    'querystring', // ?lang=en
    'cookie',      // cookies.i18next=en
    'header',      // Accept-Language: en
    'session'      // req.session.language
  ],
  
  // Other configuration options...
}
```

## 🧩 Key Components

### I18nService

The `I18nService` class provides the following API:

```typescript
export interface II18nService {
  // Get a translation function for a specific request/language
  getTFunction(req: Request, language?: string): TFunction;
  
  // Translate a key to the appropriate language
  translate(key: string, req?: Request, values?: object, language?: string): string;
  
  // Get the current active language
  getCurrentLanguage(): string;
  
  // Change the active language
  changeLanguage(language: string): Promise<void>;
  
  // Resolve a message with translation and fallback options
  resolveMessage(options: {
    translationKey: TranslationKeys,
    message?: string,
    req?: Request,
    defaultMessage?: string,
    interpolationValues?: object,
    prioritizeTranslated?: boolean
  }): string;
}
```

### Message Resolution Logic

The `resolveMessage` method implements sophisticated message resolution:

```typescript
if (prioritizeTranslated) {
  // First try translation, then fallback to provided message
  const translatedMessage = translateMessage();
  if (translatedMessage) return translatedMessage;
  return message?.trim() || defaultMessage;
} else {
  // First use provided message if available, otherwise translate
  if (message?.trim()) return message;
  const translatedMessage = translateMessage();
  return translatedMessage || defaultMessage;
}
```

## 📁 Locale File Organization

Locale files are organized by module and language:

```
src/infrastructure/i18n/locales/
├── en/
│   ├── common.json    # Common messages shared across the app
│   ├── auth.json      # Authentication-related messages
│   ├── user.json      # User-related messages
│   ├── comment.json   # Comment-related messages
│   ├── follow.json    # Follower-related messages
│   └── ...
└── vi/
    ├── common.json
    ├── auth.json
    ├── user.json
    ├── comment.json
    ├── follow.json
    └── ...
```

Each module has its own translation namespace, and messages are organized by function:

```json
// Example: en/user.json
{
  "ERRORS": {
    "USER_NOT_FOUND": "User not found",
    "USERNAME_TAKEN": "Username is already taken"
  },
  "SUCCESS": {
    "USER_CREATED": "User created successfully",
    "PROFILE_UPDATED": "Profile updated successfully"
  },
  "VALIDATION": {
    "USERNAME_REQUIRED": "Username is required",
    "INVALID_EMAIL": "Invalid email format"
  }
}
```

## 🔄 Using i18n with Errors

### 1. Define Message Keys

Each module has a message keys enum that serves as an intermediary between code and i18n translations:

```typescript
// src/modules/comments/constants/comment-messages.enum.ts
export enum CommentMessageKeys {
  COMMENT_NOT_FOUND = 'comment:COMMENT_NOT_FOUND',
  CONTENT_IS_REQUIRED = 'comment:CONTENT_IS_REQUIRED',
  COMMENT_CREATED = 'comment:COMMENT_CREATED',
  // ...other keys
}
```

### 2. Add Translations to Locale Files

Add corresponding entries to locale files for each language:

```json
// src/infrastructure/i18n/locales/en/comment.json
{
  "COMMENT_NOT_FOUND": "Comment not found",
  "CONTENT_IS_REQUIRED": "Comment content is required",
  "COMMENT_CREATED": "Comment created successfully"
}

// src/infrastructure/i18n/locales/vi/comment.json
{
  "COMMENT_NOT_FOUND": "Không tìm thấy bình luận",
  "CONTENT_IS_REQUIRED": "Nội dung bình luận là bắt buộc",
  "COMMENT_CREATED": "Đã tạo bình luận thành công"
}
```

### 3. Throw Errors with i18n Keys

```typescript
import { NotFoundError } from '~/core/errors';
import { CommentMessageKeys } from './constants/comment-messages.enum';

// In a service or controller:
throw new NotFoundError({
  messageKey: CommentMessageKeys.COMMENT_NOT_FOUND,
  details: { commentId }
});
```

### 4. Use i18n Service Directly

```typescript
import { CommentMessageKeys } from './constants/comment-messages.enum';

// In a controller:
return res.status(200).json({
  message: i18nService.translate(CommentMessageKeys.COMMENT_CREATED),
  data: newComment
});
```

## ✅ Best Practices

1. **Use Namespaces**: Always prefix message keys with module name, e.g., `comment:COMMENT_NOT_FOUND`

   ```typescript
   // Good
   const key = 'user:PROFILE_UPDATED';
   
   // Avoid
   const key = 'PROFILE_UPDATED';
   ```

2. **Keep Translations Consistent**: Ensure all keys have translations in all supported languages

   ```typescript
   // Verify translation exists in all language files
   // en/user.json, vi/user.json, etc.
   ```

3. **Group Related Messages**: Organize message keys into related groups (success, error, validation)

   ```typescript
   // Example message key organization
   export enum UserMessageKeys {
     // Error messages
     USER_NOT_FOUND = 'user:ERRORS.USER_NOT_FOUND',
     
     // Success messages
     PROFILE_UPDATED = 'user:SUCCESS.PROFILE_UPDATED',
     
     // Validation messages
     USERNAME_REQUIRED = 'user:VALIDATION.USERNAME_REQUIRED'
   }
   ```

4. **Use Documentation**: Add JSDoc to enums and explain message usage

   ```typescript
   /**
    * Message keys for auth-related operations
    * @namespace auth
    */
   export enum AuthMessageKeys {
     /**
      * Used when login credentials are invalid
      */
     INVALID_CREDENTIALS = 'auth:INVALID_CREDENTIALS',
     
     // ...other keys
   }
   ```

5. **Use Interpolation for Dynamic Content**:

   ```typescript
   // With dynamic values
   i18nService.translate(
     UserMessageKeys.PASSWORD_TOO_SHORT,
     { min: 8, current: password.length }
   )
   
   // Corresponding translation in en/user.json
   {
     "PASSWORD_TOO_SHORT": "Password must be at least {{min}} characters (currently {{current}})"
   }
   ```

6. **Default to Common Messages**: For generic errors, use common message keys:

   ```typescript
   import { CommonMessageKeys } from '~/shared/enums/common-messages.enum';
   
   throw new BadRequestError({
     messageKey: CommonMessageKeys.BAD_REQUEST
   });
   ```

## 📝 Examples

### Example 1: Using i18n in Controllers

```typescript
@controller('/comments')
export class CommentController extends BaseController {
  @post('/')
  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { content, tweetId } = req.body;
      
      if (!content) {
        throw new BadRequestError({
          messageKey: CommentMessageKeys.CONTENT_IS_REQUIRED
        });
      }
      
      const newComment = await this.commentService.createComment(
        req.user.id, 
        content, 
        tweetId
      );
      
      return this.success(res, {
        message: this.i18nService.translate(CommentMessageKeys.COMMENT_CREATED, req),
        data: newComment
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### Example 2: Using i18n in Services

```typescript
@injectable()
export class CommentService {
  constructor(
    @inject(DI_TYPES.I18nService) private readonly i18nService: II18nService
  ) {}
  
  async getCommentById(commentId: string, req?: Request) {
    const comment = await this.commentRepository.findById(commentId);
    
    if (!comment) {
      throw new NotFoundError({
        message: this.i18nService.translate(
          CommentMessageKeys.COMMENT_NOT_FOUND, 
          req,
          { id: commentId }
        ),
        messageKey: CommentMessageKeys.COMMENT_NOT_FOUND,
        details: { commentId }
      });
    }
    
    return comment;
  }
}
```

### Example 3: Advanced Message Resolution

```typescript
// In an API response handler:
return new ApiResponse({
  code: RESPONSE_CODES.SUCCESS.code,
  message: i18nService.resolveMessage({
    translationKey: UserMessageKeys.PROFILE_UPDATED,
    message: 'Profile has been successfully updated',
    req: req,
    interpolationValues: { 
      username: user.username,
      changes: Object.keys(updates).length 
    }
  })
});
```

## 🌏 Adding a New Language

To add a new language:

1. **Update Configuration**: Add language code to supported languages

   ```typescript
   // i18n.config.ts
   export const i18nConfig = {
     supportedLanguages: ['en', 'vi', 'fr', 'es'], // Added 'es'
     // ...other config
   }
   ```

2. **Create Directory Structure**: Add language folder and copy structure from English

   ```
   src/infrastructure/i18n/locales/
   └── es/
       ├── common.json
       ├── auth.json
       ├── user.json
       └── ...
   ```

3. **Translate Message Files**: Translate all message strings in each file

4. **Test New Language**: Use language switching to verify translations

5. **Document New Language**: Update relevant documentation and user guides
