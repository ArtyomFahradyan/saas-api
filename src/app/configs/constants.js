export const VALIDATION_ERROR = `Request didn't pass validation`;
export const PERMISSION_DENIED = 'Permission Denied';
export const SOMETHING_WENT_WRONG = 'Something went wrong, please try again';
export const REQUIRED = resource => `${resource} is required`;
export const INVALID = resource => `${resource} is invalid`;
export const ALREADY_EXISTS = resource => `${resource} already exists!`;
export const NOT_EXISTS = resource => `${resource} doesn't exist!`;
export const INVALID_EMAIL_OR_PASSWORD = 'Invalid email or password';
export const INVALID_CURRENT_PASSWORD = 'Your current password is wrong';
export const SERVICE_UNAVAILABLE = 'Service is temporarily unavailable';
export const VERIFICATION_ERROR = 'Your account is not verified, please check your email for activation information.';
export const USER_AUTH = 'user-rule';
export const ADMIN_AUTH = 'admin-rule';
export const TOKEN_EXPIRED = 'Token expired';
export const CONFLICT_MESSAGE = 'The request could not be completed';

export const MA = 'MA';

export const VERIFICATION_EMAIL_SUBJECT = 'Verify your email';
export const VERIFICATION_MESSAGE = (link) => `<p>Please <a href="${link}">click here</a> to confirm your email</p>`;

export const RESET_PASSWORD_SUBJECT = 'Reset password has been requested.';
export const RESET_PASSWORD_MESSAGE = (link) => `<p>Please <a href="${link}">click here</a> to reset your password</p>`;

export const INVITATION_MESSAGE = (link) => `<p>Please <a href="${link}">click here</a> to set your password</p>`;
export const INVITATION_SUBJECT = 'SaaStracked invitation';

export const NOTIFICATION_SUBJECT = 'SaaStracked notifications';
export const NOTIFICATION_MESSAGE = 'You have new notifications';
