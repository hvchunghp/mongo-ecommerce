export enum AUTH_MESSAGES {
  UNAUTHORIZED = 'UNAUTHORIZED',
  SESSION_EXPIRED = 'SESSION EXPIRED',
  RESET_PASSWORD_SUCCESS = 'Reset password success.',
  LOGOUT_SUCCESS = 'Logout success.',
  WRONG_LAST_PASSWORD = 'Last password was wrong.',
  PERMISSION_DENIED = 'Permission denied.',
}

export enum AUTH_ERROR {
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_ERROR = 'TOKEN_INVALID',
}
