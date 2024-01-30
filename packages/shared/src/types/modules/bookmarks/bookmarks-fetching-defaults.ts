import { SortBy } from './sort-by'
import { Order } from './order'

export namespace BookmarksFetchingDefaults {
  export namespace Common {
    export const order = Order.Desc
    export const sort_by = SortBy.CreatedAt
  }

  export namespace Authorized {
    export const public_only = false
  }
}
