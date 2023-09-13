import { LibraryFilter } from '@shared/types/common/library-filter'
import { Order } from '@shared/types/modules/bookmarks/order'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'

export namespace BookmarksParams {
  type Base = {
    sortBy?: SortBy
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
