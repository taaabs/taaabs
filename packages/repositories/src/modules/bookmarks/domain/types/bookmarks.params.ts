import { LibraryFilter } from '@shared/types/common/library-filter'
import { Sort } from '@shared/types/modules/bookmarks/sort'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'

export namespace BookmarksParams {
  type Base = {
    sortBy?: SortBy
    sort?: Sort
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
