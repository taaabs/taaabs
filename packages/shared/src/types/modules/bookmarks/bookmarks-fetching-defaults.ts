import { Sortby } from './sort-by'
import { Order } from './order'
import { LibraryFilter } from '@shared/types/common/library-filter'

export namespace BookmarksFetchingDefaults {
  export namespace Common {
    export const filter = LibraryFilter.All
    export const order = Order.Desc
    export const sortBy = Sortby.CreatedAt
  }

  export namespace Authorized {
    export const publicOnly = false
  }
}
