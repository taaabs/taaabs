import { SortBy } from './sort-by'
import { Order } from './order'

export namespace BookmarksFetchingDefaults {
  export namespace Common {
    export const order = Order.DESC
    export const sort_by = SortBy.CREATED_AT
  }

  export namespace Authorized {
    export const public_only = false
  }
}
