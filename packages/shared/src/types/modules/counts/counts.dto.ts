import { LibraryFilter } from '@shared/types/common/library-filter'
import { CountsFetchingDefaults } from './counts-fetching-defaults'
import { ToBoolean } from '@shared/decorators/to-boolean'

export namespace Counts_Dto {
  export namespace QueryParams {
    class Base {
      public filter?: LibraryFilter = CountsFetchingDefaults.Common.filter
      public category_id?: string
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
      public unread_count?: number
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

    class Counts {
      public is_stale?: boolean
    }

    export class Authorized extends Counts {
      public months?: Record<string, AuthorizedMonth>
    }
    export class Public extends Counts {
      public months?: Record<string, PublicMonth>
    }
  }
}
