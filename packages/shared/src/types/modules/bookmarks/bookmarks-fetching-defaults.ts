import { Sortby } from './sortby'
import { Order } from './order'
import { LibraryFilter } from '@shared/types/common/library-filter'

export namespace BookmarksFetchingDefaults {
  export namespace Common {
    export const filter = LibraryFilter.All
    export const order = Order.Desc
    export const sortby = Sortby.CreatedAt
  }

  export namespace Authorized {
    export const public_only = false
  }
}
