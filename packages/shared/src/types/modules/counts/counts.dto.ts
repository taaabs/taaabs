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

  class Month {
    public tags: Record<string, { yields: number; id: number }>
    public bookmark_count: number
    public starred_count?: number
    public unread_count?: number
  }

  export class Response {
    public months?: Record<string, Month>
    public is_counts_update_scheduled?: boolean
  }
}
