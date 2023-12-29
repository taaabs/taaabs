import { Sortby } from './sortby'
import { Order } from './order'
import { Filter } from '@shared/types/common/filter'

export namespace BookmarksFetchingDefaults {
  export namespace Common {
    export const filter = Filter.All
    export const order = Order.Desc
    export const sortby = Sortby.CreatedAt
  }

  export namespace Authorized {
    export const public_only = false
  }
}
