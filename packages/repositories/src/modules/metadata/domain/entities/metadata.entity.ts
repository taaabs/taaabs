export namespace MetadataEntity {
  type Metadata = {
    username: string
    displayName: string | null
  }

  export type Authorized = Metadata & {
    registeredAt: Date
    isEmailConfirmed: boolean
  }
  export type Public = Metadata & {
    metaDescription: string
  }
}
