import { Filter } from '@shared/types/common/filter'
import { Order } from '@shared/types/modules/bookmarks/order'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'

export namespace GetBookmarks_Params {
  type Base = {
    sort_by?: SortBy
    order?: Order
    tags?: string[]
    after?: number
    filter?: Filter
    yyyymm_gte?: number
    yyyymm_lte?: number
  }
  export type Authorized = Base
  export type Public = Base & {
    username: string
  }
}
