export namespace UserMetadataEntity {
  type User = {
    username: string
    displayName: string | null
  }

  export type Authorized = User & {
    email: string
    isEmailConfirmed: boolean
  }

  export type Public = User
}
