import { LibraryFilter } from '@shared/types/common/library-filter'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'

export namespace BookmarksParams {
  type Base = {
    sortBy?: SortBy
    orderBy?: OrderBy
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
