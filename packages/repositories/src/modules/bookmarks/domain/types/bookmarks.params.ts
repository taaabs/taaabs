import { LibraryFilter } from '@shared/types/common/library-filter'
import { Order } from '@shared/types/modules/bookmarks/order'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'

export namespace BookmarksParams {
  type Base = {
    orderBy?: OrderBy
    order?: Order
    tags?: string[]
    categoryId?: string
    after?: string
    filter?: LibraryFilter
    yyyymmGte?: number
    yyyymmLte?: number
  }
  export type Authorized = Base & {
    publicOnly?: boolean
  }
  export type Public = Base & {
    username: string
  }
}
