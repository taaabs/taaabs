export namespace MetadataRo {
  type MetadataBase = {
    username: string
    display_name?: string
    avatar?: {
      url: string
      blurhash: string
    }
  }

  export type Authorized = {
    registered_at: Date
    is_email_confirmed: boolean
  } & MetadataBase

  export type Public = {
    meta_description?: string
  } & MetadataBase
}
