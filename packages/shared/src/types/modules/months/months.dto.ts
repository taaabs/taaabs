import { LibraryFilter } from '@shared/types/common/library-filter'
import { MonthsFetchingDefaults } from './months-fetching-defaults'
import { ToBoolean } from '@shared/decorators/to-boolean'

export namespace Months_Dto {
  export namespace QueryParams {
    class Base {
      public filter?: LibraryFilter = MonthsFetchingDefaults.Common.filter
      public category_id?: string
      public tags?: string
    }
    export class Authorized extends Base {
      @ToBoolean()
      public public_only?: boolean =
        MonthsFetchingDefaults.Authorized.publicOnly
    }
    export class Public extends Base {}
  }

  class Month {
    public tags: Record<string, { yields: number; id: number }>
    public bookmark_count: number
    public starred_count?: number
    public nsfw_count?: number
  }

  export class Response {
    public months?: Record<string, Month>
    public is_months_update_scheduled?: boolean
  }
}
