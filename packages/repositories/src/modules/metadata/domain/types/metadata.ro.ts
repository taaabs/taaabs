export namespace MetadataRo {
  type MetadataBase = {
    username: string
    displayName: string | null
    avatar: {
      url: string
      blurhash: string
    } | null
  }

  export type Authorized = {
    registeredAt: Date
    isEmailConfirmed: boolean
  } & MetadataBase

  export type Public = {
    metaDescription: string | null
  } & MetadataBase
}
