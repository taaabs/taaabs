export namespace UserProfileEntity {
  type User = {
    username: string
    displayName: string | null
  }

  export type CurrentUser = User & {
    email: string
    isEmailConfirmed: boolean
  }
  export type OtherUser = User
}
