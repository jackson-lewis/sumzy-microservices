export type User = {
  name: string
  email: string
}

export type UnverifiedUser = {
  emailVerifyLink: string
} & User

export type ForgotPasswordUser = {
  resetPasswordLink: string
} & User

