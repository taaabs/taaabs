import { ToBoolean } from '../../../../src/decorators/to-boolean'
import { CountsFetchingDefaults } from './counts-fetching-defaults'

export namespace Counts_Dto {
  export namespace SearchParams {
    class Base {
      @ToBoolean()
      public starred_only?: boolean

      @ToBoolean()
      public unsorted_only?: boolean

      @ToBoolean()
      public is_archived?: boolean

      public tags?: string
    }
    export class Authorized extends Base {
      @ToBoolean()
      public public_only?: boolean =
        CountsFetchingDefaults.Authorized.public_only
    }
    export class Public extends Base {}
  }

  export namespace Response {
    class AuthorizedMonth {
      public tags: {
        name?: string
        name_aes?: string
        yields: number
        id: number
      }[]
      public bookmark_count: number
      public starred_count?: number
      public unsorted_count?: number
    }

    class PublicMonth {
      public tags: {
        name: string
        yields: number
        id: number
      }[]
      public bookmark_count: number
      public starred_count?: number
    }

    export class Authorized {
      public months: Record<string, AuthorizedMonth>
      public is_importing_or_processing?: boolean
    }
    export class Public {
      public months: Record<string, PublicMonth>
      public is_importing_or_processing?: boolean
    }
  }
}
