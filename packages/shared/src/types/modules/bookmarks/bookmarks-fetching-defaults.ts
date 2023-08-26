import { SortBy } from './sort-by'
import { Sort } from './sort'
import { LibraryFilter } from '@shared/types/common/library-filter'

export namespace BookmarksFetchingDefaults {
  export namespace Common {
    export const filter = LibraryFilter.All
    export const sortBy = SortBy.BookmarkedAt
    export const sort = Sort.Desc
  }

  export namespace Authorized {
    export const publicOnly = false
  }
}
