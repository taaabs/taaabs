import { SortBy } from './sort-by'
import { OrderBy } from './order-by'
import { LibraryFilter } from '@shared/types/common/library-filter'

export namespace BookmarksFetchingDefaults {
  export namespace Common {
    export const filter = LibraryFilter.All
    export const sortBy = SortBy.BookmarkedAt
    export const orderBy = OrderBy.Desc
  }

  export namespace Authorized {
    export const publicOnly = false
  }
}
