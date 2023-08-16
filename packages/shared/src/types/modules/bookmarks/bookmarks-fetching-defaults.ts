import { OrderBy } from './order-by'
import { Order } from './order'
import { LibraryFilter } from '@shared/types/common/library-filter'

export namespace BookmarksFetchingDefaults {
  export namespace Common {
    export const filter = LibraryFilter.All
    export const orderBy = OrderBy.BookmarkCreationDate
    export const order = Order.Desc
  }

  export namespace Authorized {
    export const publicOnly = false
  }
}
