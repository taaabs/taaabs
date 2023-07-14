import { DateRange } from '@shared/types/modules/bookmarks/date-range'
import { OrderBy } from './order-by'
import { Order } from './order'
import { LibraryFilter } from '@shared/types/common/library-filter'

export namespace BookmarksFetchingDefaults {
  export namespace Common {
    export const dateRange = DateRange.Any
    export const orderBy = OrderBy.BookmarkCreationDate
    export const order = Order.Desc
    export const filter = LibraryFilter.All
  }

  export namespace AuthorizedUser {
    export const publicOnly = false
  }
}
