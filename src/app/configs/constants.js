export const VALIDATION_ERROR = `requestDidn'tPassValidation`;
export const PERMISSION_DENIED = 'permissionDenied';
export const SOMETHING_WENT_WRONG = 'somethingWentWrong';
export const REQUIRED = resource => `${resource} is required`;
export const INVALID = resource => `${resource} is invalid`;
export const ALREADY_EXISTS = resource => `${resource} already exists!`;
export const NOT_EXISTS = resource => `${resource} doesn't exist!`;
export const INVALID_EMAIL_OR_PASSWORD = 'invalidEmailOrPassword';
export const INVALID_CURRENT_PASSWORD = 'yourCurrentPasswordIsWrong';
export const SERVICE_UNAVAILABLE = 'serviceIsTemporarilyUnavailable';
export const VERIFICATION_ERROR = 'yourAccountIsNotVerified';
export const USER_AUTH = 'user-rule';
export const ADMIN_AUTH = 'admin-rule';
export const TOKEN_EXPIRED = 'tokenExpired';
export const CONFLICT_MESSAGE = 'theRequestCouldNotGeCompleted';

export const NEW_UPLOADED_FILE_MESSAGE = (company) => `New pdf file was uploaded from company ${company}`;
export const UPLOADED_FILE_MESSAGE = (contract) => `New pdf file was uploaded to contract with ${contract} id`;

export const REMINDER_RANGE = [ 1, 2, 3 ];
export const MA = 'MA';

export const VERIFICATION_EMAIL_SUBJECT = 'Verify your email';
export const VERIFICATION_MESSAGE = (link) => `<p>Please <a href="${link}">click here</a> to confirm your email</p>`;

export const RESET_PASSWORD_SUBJECT = 'Reset password has been requested.';
export const RESET_PASSWORD_MESSAGE = (link) => `<p>Please <a href="${link}">click here</a> to reset your password</p>`;

export const INVITATION_MESSAGE = (link) => `<p>Please <a href="${link}">click here</a> to set your password</p>`;
export const INVITATION_SUBJECT = 'SaaStracked invitation';

export const NOTIFICATION_SUBJECT = 'SaaStracked notifications';
export const NOTIFICATION_MESSAGE = 'You have new notifications';

export const CRONTIMEZONE = 'America/New_York';
export const CRONTIME1 = '0 7 * * *';
export const CRONTIME2 = '15 7 * * *';
export const CRONTIME3 = '30 7 * * *';
