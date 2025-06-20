/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-05-23 10:20:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-04 11:01:58
 * @FilePath      : /server/src/shared/enums/validation-translation.enum.ts
 * @Description   : Validation translation keys enum
 */

/**
 * Enumeration of validation translation keys
 * Format: 'validation:KEY'
 */
export enum ValidationTranslationKeys {
  /**
   * General validation errors
   */
  REQUIRED = 'validation:REQUIRED',
  INVALID = 'validation:INVALID',
  TYPE_MISMATCH = 'validation:TYPE_MISMATCH',
  FORMAT_INVALID = 'validation:FORMAT_INVALID',
  CUSTOM_VALIDATION = 'validation:CUSTOM_VALIDATION',
  UNKNOWN_VALIDATION = 'validation:UNKNOWN_VALIDATION',

  /**
   * Size & Length constraints
   */
  MIN_LENGTH = 'validation:MIN_LENGTH',
  MAX_LENGTH = 'validation:MAX_LENGTH',
  LENGTH_BETWEEN = 'validation:LENGTH_BETWEEN',
  MIN_VALUE = 'validation:MIN_VALUE',
  MAX_VALUE = 'validation:MAX_VALUE',
  VALUE_BETWEEN = 'validation:VALUE_BETWEEN',
  CANNOT_BE_EMPTY = 'validation:CANNOT_BE_EMPTY',

  /**
   * Type-specific validations
   */
  MUST_BE_STRING = 'validation:MUST_BE_STRING',
  MUST_BE_NUMBER = 'validation:MUST_BE_NUMBER',
  MUST_BE_BOOLEAN = 'validation:MUST_BE_BOOLEAN',
  MUST_BE_DATE = 'validation:MUST_BE_DATE',
  MUST_BE_ARRAY = 'validation:MUST_BE_ARRAY',
  MUST_BE_OBJECT = 'validation:MUST_BE_OBJECT',
  MUST_BE_UNIQUE = 'validation:MUST_BE_UNIQUE',

  /**
   * ID and existence validations
   */
  MUST_BE_VALID_ID = 'validation:MUST_BE_VALID_ID',
  ALREADY_EXISTS = 'validation:ALREADY_EXISTS',
  NOT_FOUND = 'validation:NOT_FOUND',
  ENUM_INVALID = 'validation:ENUM_INVALID',
  UNEXPECTED_KEYS = 'validation:UNEXPECTED_KEYS',
  LITERAL_MISMATCH = 'validation:LITERAL_MISMATCH',

  /**
   * Format specific validations - Zod specific error codes
   */
  EMAIL_INVALID = 'validation:FORMATS.EMAIL_INVALID',
  URL_INVALID = 'validation:FORMATS.URL_INVALID',
  UUID_INVALID = 'validation:FORMATS.UUID_INVALID',
  CUID_INVALID = 'validation:FORMATS.CUID_INVALID',
  REGEX_INVALID = 'validation:FORMATS.REGEX_INVALID',
  DATE_INVALID = 'validation:FORMATS.DATE_INVALID',
  NUMERIC_INVALID = 'validation:FORMATS.NUMERIC_INVALID',
  ALPHANUMERIC_INVALID = 'validation:FORMATS.ALPHANUMERIC_INVALID',
  PASSWORD_COMPLEXITY = 'validation:FORMATS.PASSWORD_COMPLEXITY',

  /**
   * Field-specific validation errors
   */
  // Email
  EMAIL_INVALID_FORMAT = 'validation:FIELDS.EMAIL.INVALID_FORMAT',
  EMAIL_NOT_VERIFIED = 'validation:FIELDS.EMAIL.NOT_VERIFIED',
  
  // Password
  PASSWORD_WEAK = 'validation:FIELDS.PASSWORD.WEAK',
  PASSWORD_CONFIRMATION_MISMATCH = 'validation:FIELDS.PASSWORD.CONFIRMATION_MISMATCH',
  
  // User Profile
  USERNAME_INVALID_FORMAT = 'validation:FIELDS.USERNAME.INVALID_FORMAT',
  PHONE_INVALID_FORMAT = 'validation:FIELDS.PHONE.INVALID_FORMAT',
  
  // Date of Birth
  DATE_OF_BIRTH_INVALID_FORMAT = 'validation:FIELDS.DATE_OF_BIRTH.INVALID_FORMAT',
  DATE_OF_BIRTH_TOO_YOUNG = 'validation:FIELDS.DATE_OF_BIRTH.TOO_YOUNG',
  DATE_OF_BIRTH_TOO_OLD = 'validation:FIELDS.DATE_OF_BIRTH.TOO_OLD',
  
  // Profile Fields
  BIO_LENGTH = 'validation:FIELDS.BIO.LENGTH',
  WEBSITE_LENGTH = 'validation:FIELDS.WEBSITE.LENGTH',
  LOCATION_LENGTH = 'validation:FIELDS.LOCATION.LENGTH',
  
  // Media
  AVATAR_INVALID_FORMAT = 'validation:FIELDS.AVATAR.INVALID_FORMAT',
  AVATAR_SIZE = 'validation:FIELDS.AVATAR.SIZE',
  COVER_INVALID_FORMAT = 'validation:FIELDS.COVER.INVALID_FORMAT',
  COVER_SIZE = 'validation:FIELDS.COVER.SIZE',

  // GeoJSON
  GEOJSON_INVALID = 'validation:FORMATS.GEOJSON_INVALID',
}
