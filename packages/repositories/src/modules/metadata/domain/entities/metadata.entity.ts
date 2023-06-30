export namespace MetadataEntity {
  type MetadataBase = {
    username: string
    displayName: string | null
  }

  export type Authorized = MetadataBase & {
    registeredAt: Date
    isEmailConfirmed: boolean
  }
  export type Public = MetadataBase & {
    metaDescription: string
  }
}
