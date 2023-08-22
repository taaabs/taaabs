import { SortBy } from './sort-by'
import { Sort } from './sort'
import { LibraryFilter } from '@shared/types/common/library-filter'

export namespace BookmarksFetchingDefaults {
  export namespace Common {
    export const filter = LibraryFilter.All
    export const sortBy = SortBy.BookmarkCreationDate
    export const sort = Sort.Latest
  }

  export namespace Authorized {
    export const publicOnly = false
  }
}
