import { Order } from '@shared/types/modules/bookmarks/order'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'

export namespace GetBookmarks_Params {
  type Base = {
    sort_by?: SortBy
    order?: Order
    tags?: string[]
    after?: number
    starred_only?: boolean
    unsorted_only?: boolean
    is_archived?: boolean
    yyyymm_gte?: number
    yyyymm_lte?: number
  }
  export type Authorized = Base
  export type Public = Base & {
    username: string
  }
}
