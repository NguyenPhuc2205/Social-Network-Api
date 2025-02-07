export const USERS_MESSAGES = {
  //* Generic Errors
  BAD_REQUEST: 'Bad request, please check your input.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
  SERVICE_UNAVAILABLE: 'Service is currently unavailable, please try again later.',
  USER_NOT_FOUND: 'The specified user could not be found.',
  VALIDATION_ERROR: 'Validation error.',

  //* Name (v)
  NAME_IS_REQUIRED: 'Name is required.',
  NAME_MUST_BE_STRING: 'Name must be a string.',
  NAME_LENGTH: 'Name must be between 2 and 100 characters.',

  //* Email (v)
  EMAIL_IS_REQUIRED: 'Email is required.',
  EMAIL_MUST_BE_STRING: 'Email must be a string.',
  EMAIL_INVALID: 'Invalid email format.',
  EMAIL_ALREADY_EXISTS: 'Email already exists.',

  //* Password
  PASSWORD_IS_REQUIRED: 'Password is required.',
  PASSWORD_MUST_BE_STRING: 'Password must be a string.',
  PASSWORD_LENGTH: 'Password must be between 6 and 50 characters.',
  PASSWORD_COMPLEXITY:
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',

  //* Password Confirmation
  PASSWORD_CONFIRMATION_IS_REQUIRED: 'Password confirmation is required.',
  PASSWORD_CONFIRMATION_MUST_BE_STRING: 'Password confirmation must be a string.',
  PASSWORD_CONFIRMATION_LENGTH: 'Password confirmation must be between 6 and 50 characters.',
  PASSWORD_CONFIRMATION_MISMATCH: 'Password confirmation does not match password.',

  //* Date of Birth
  DATE_OF_BIRTH_IS_REQUIRED: 'Date of birth is required.',
  DATE_OF_BIRTH_INVALID: 'Invalid date of birth format.',
  DATE_OF_BIRTH_TOO_YOUNG: 'Date of birth must be at least 18 years old.',
  DATE_OF_BIRTH_TOO_OLD: 'Date of birth must be less than 100 years old.',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO 8601.',

  //* Bio
  BIO_IS_REQUIRED: 'Biography is required.',
  BIO_MUST_BE_STRING: 'Biography must be a string.',
  BIO_LENGTH: 'Biography must be between 2 and 200 characters.',

  //* Website
  WEBSITE_IS_REQUIRED: 'Website is required.',
  WEBSITE_MUST_BE_STRING: 'Website must be a string.',
  WEBSITE_LENGTH: 'Website must be between 2 and 200 characters.',

  //* Username
  USERNAME_IS_REQUIRED: 'Username is required.',
  USERNAME_MUST_BE_STRING: 'Username must be a string.',
  USERNAME_LENGTH: 'Username must be between 2 and 100 characters.',

  //* Avatar
  AVATAR_IS_REQUIRED: 'Avatar is required.',
  AVATAR_MUST_BE_STRING: 'Avatar must be a string.',
  AVATAR_INVALID_FORMAT: 'Invalid avatar format.',
  AVATAR_SIZE: 'Avatar size must be less than or equal to 5MB.',
  AVATAR_LENGTH: 'Avatar must be between 2 and 500 characters.',

  //* Cover
  COVER_IS_REQUIRED: 'Cover is required.',
  COVER_MUST_BE_STRING: 'Cover must be a string.',
  COVER_INVALID_FORMAT: 'Invalid cover format.',
  COVER_SIZE: 'Cover size must be less than or equal to 5MB.',
  COVER_LENGTH: 'Cover must be between 2 and 500 characters.',

  //* Success
  REGISTER_SUCCESS: 'Registration successful.',
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logout successful.',
  USER_UPDATED_SUCCESS: 'User updated successfully.',
  USER_DELETED_SUCCESS: 'User deleted successfully.',

  //* Failure Messages
  REGISTER_FAILURE: 'Registration failed.',
  LOGIN_FAILURE: 'Login failed.',
  LOGOUT_FAILURE: 'Logout failed.',
  USER_UPDATE_FAILURE: 'User update failed.',
  USER_DELETE_FAILURE: 'User deletion failed.',

  //* Authentication
  PASSWORD_IS_INCORRECT: 'Password is incorrect.', //401
  EMAIL_IS_NOT_REGISTERED: 'Email is not registered.', //422

  //* Account Status
  ACCOUNT_LOCKED: 'Account is locked.',
  ACCOUNT_ACTIVATION_PENDING: 'Account activation pending.',
  ACCOUNT_ACTIVATION_SUCCESS: 'Account activated successfully.',
  ACCOUNT_ALREADY_ACTIVATED: 'Account already activated.',

  //* Miscellaneous
  OPERATION_NOT_PERMITTED: 'Operation not permitted.',
  SESSION_EXPIRED: 'Session expired, please log in again.',
  PERMISSION_DENIED: 'Permission denied.',
  INVALID_CREDENTIALS: 'Invalid credentials provided.',

  //* Notifications
  NOTIFICATION_SUCCESS: 'Notification sent successfully.',
  NOTIFICATION_FAILURE: 'Failed to send notification.',

  //* Token (General mesage)
  TOKEN: {
    _IS_REQUIRED: '{token_type} is required.',
    _INVALID: '{token_type} is invalid',
    _EXPIRED: '{token_type} has expired.',
    _NOT_FOUND: '{token_type} not found.',
    _CANNOT_BE_USED_AGAIN: '{token_type} cannot be used again.',
    _CREATION_FAILURE: 'Failed to create {token_type}.',
    _ALREADY_EXISTS: '{token_type} already exists.',
    _NOT_ACTIVATED: '{token_type} is not activated yet.', //Not before err message
    _USED_TOKEN_OR_NOT_EXIST: 'Used {token_type} or does not exist.',
    _FAILED_TO_SIGN_TOKEN: 'Failed to sign {token_type}'
  },

  //* Authorization Header (Bearer <access_token>)
  AUTHORIZATION_IS_REQUIRED: 'Authorization is required.',
  AUTHORIZAION_MUST_START_WITH_BEARER: 'Authorization must start with "Bearer".',
  ACCESS_TOKEN_MISSING: 'Access token is missing after "Bearer".',

  //* Token Validation
  TOKEN_INVALIDATION_FAILURE: 'Failed to invalidate token.',
  TOKEN_VERIFICATION_FAILED: 'Token verification failed.',

  //* Verify Email
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email has already been verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verify successful',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',

  //* Forgot password
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password successfully',
  GET_ME_SUCCESS: 'Get me success',
  RESET_PASSWORD_SUCCESS: 'Reset password successfully',

  //* Get/ Update profile
  USER_NOT_VERIFIED: 'User has not verified account yet.',
  GET_USER_PROFILE_SUCCESS: 'User profile retrieved successfully.',
  UPDATE_ME_SUCCESS: 'Profile updated successfully.',

  //* Id
  USER_ID_IS_REQUIRED: 'User id is required.',
  INVALID_USER_ID: 'User id is invalid.',

  //* Follow/ Unfollow
  FOLLOW_USER_SUCCESS: 'You have successfully followed the user.',
  FOLLOWED_USER: 'You are already following this user.',
  NOT_FOLLOWING_OR_ALREADY_UNFOLLOWED: 'You are either not following this user or have already unfollowed them.',
  UNFOLLOW_SUCCESS: 'Unfollow user successuffly'
} as const
