/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-25 12:40:36
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-25 19:12:07
 * @FilePath      : /server/src/shared/enums/suggestion-translation.enum.ts
 * @Description   : Suggestion translation keys enum for validation error suggestions
 */

/**
 * Enumeration of suggestion translation keys for validation error suggestions. Always use in child validation error messages
 * format: 'suggestions:KEY'
 */
export enum SuggestionTranslationKeys {
  /**
   * Email validation suggestions
   */
  EMAIL_FORMAT_HELP = 'suggestions:EMAIL_FORMAT_HELP',
  
  /**
   * URL validation suggestions
   */
  URL_FORMAT_HELP = 'suggestions:URL_FORMAT_HELP',
  
  /**
   * UUID validation suggestions
   */
  UUID_FORMAT_HELP = 'suggestions:UUID_FORMAT_HELP',
  
  /**
   * Password validation suggestions
   */
  PASSWORD_MIN_LENGTH = 'suggestions:PASSWORD_MIN_LENGTH',
  PASSWORD_COMPLEXITY = 'suggestions:PASSWORD_COMPLEXITY',
  
  /**
   * Username validation suggestions
   */
  USERNAME_MIN_LENGTH = 'suggestions:USERNAME_MIN_LENGTH',
  
  /**
   * Bio validation suggestions
   */
  BIO_MAX_LENGTH = 'suggestions:BIO_MAX_LENGTH',
    /**
   * Website validation suggestions
   */
  WEBSITE_MAX_LENGTH = 'suggestions:WEBSITE_MAX_LENGTH',
  
  /**
   * Location validation suggestions
   */
  LOCATION_MAX_LENGTH = 'suggestions:LOCATION_MAX_LENGTH',
  
  /**
   * Phone validation suggestions
   */
  PHONE_FORMAT_HELP = 'suggestions:PHONE_FORMAT_HELP',
  
  /**
   * Date validation suggestions
   */
  DATE_FORMAT_HELP = 'suggestions:DATE_FORMAT_HELP',
  DATE_OF_BIRTH_HELP = 'suggestions:DATE_OF_BIRTH_HELP',
  
  /**
   * Number validation suggestions
   */
  NUMBER_REQUIRED = 'suggestions:NUMBER_REQUIRED',
  NUMBER_MIN_VALUE = 'suggestions:NUMBER_MIN_VALUE',
  NUMBER_MAX_VALUE = 'suggestions:NUMBER_MAX_VALUE',
  
  /**
   * String validation suggestions
   */
  STRING_REQUIRED = 'suggestions:STRING_REQUIRED',
  STRING_MIN_LENGTH = 'suggestions:STRING_MIN_LENGTH',
  STRING_MAX_LENGTH = 'suggestions:STRING_MAX_LENGTH',
  
  /**
   * Array validation suggestions
   */
  ARRAY_MIN_ITEMS = 'suggestions:ARRAY_MIN_ITEMS',
  ARRAY_MAX_ITEMS = 'suggestions:ARRAY_MAX_ITEMS',
  
  /**
   * Type validation suggestions
   */
  TYPE_EXPECTED = 'suggestions:TYPE_EXPECTED',
  
  /**
   * Enum validation suggestions
   */
  ENUM_VALUES = 'suggestions:ENUM_VALUES',
  
  /**
   * Required field suggestions
   */
  FIELD_REQUIRED = 'suggestions:FIELD_REQUIRED',
  
  /**
   * Custom validation suggestions
   */
  CUSTOM_VALIDATION_FAILED = 'suggestions:CUSTOM_VALIDATION_FAILED',
}
