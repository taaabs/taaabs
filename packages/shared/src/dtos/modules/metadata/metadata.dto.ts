export namespace MetadataDto {
  export namespace Response {
    class BaseMetadata {
      username: string
      display_name?: string
      avatar?: {
        url: string
        blurhash: string
      }
    }

    export class Authorized extends BaseMetadata {
      registered_at: string
      is_email_confirmed: boolean
    }

    export class Public extends BaseMetadata {
      meta_description?: string // Used for SEO on server-side generated user pages
    }
  }
}
