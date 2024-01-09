import { SortBy } from './sort-by'
import { Order } from './order'
import { Filter } from '@shared/types/common/filter'

export namespace BookmarksFetchingDefaults {
  export namespace Common {
    export const filter = Filter.None
    export const order = Order.Desc
    export const sort_by = SortBy.CreatedAt
  }

  export namespace Authorized {
    export const public_only = false
  }
}
