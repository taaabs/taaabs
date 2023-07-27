export namespace MetadataRo {
  type MetadataBase = {
    username: string
    displayName?: string
    avatar?: {
      url: string
      blurhash: string
    }
  }

  export type Authorized = {
    registeredAt: Date
    isEmailConfirmed: boolean
  } & MetadataBase

  export type Public = {
    metaDescription?: string
  } & MetadataBase
}
