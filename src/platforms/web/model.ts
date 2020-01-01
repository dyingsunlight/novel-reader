export interface User {
  name: string
  username: string
  email: string
  password: string
}

export interface Session {
  sessionId: string
  sessionExpireTime: string
}

export enum UserError {
  passwordNotIdentical = 'password is not identical',
  passwordError = 'Password incorrect.',
  userExisted = 'username already exist',
  userNotExisted = 'user not existed',
  unknown = 'unknown error',
  validationFailed = 'validation was failed',
  invalidParameters = 'Given parameters was invalid.'
}
