export namespace MetadataDto {
  export namespace Response {
    class Base {
      public username: string
      public display_name?: string
      public avatar?: {
        url: string
        blurhash: string
      }
    }

    export class Authorized extends Base {
      public registered_at: string
      public is_email_confirmed: boolean
    }

    export class Public extends Base {
      public meta_description?: string
    }
  }
}
