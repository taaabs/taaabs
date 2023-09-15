import { LibraryFilter } from '@shared/types/common/library-filter'
import { Order } from '@shared/types/modules/bookmarks/order'
import { Sortby } from '@shared/types/modules/bookmarks/sortby'

export namespace BookmarksParams {
  type Base = {
    sort_by?: Sortby
    order?: Order
    tags?: string[]
    category_id?: string
    after?: string
    filter?: LibraryFilter
    yyyymm_gte?: number
    yyyymm_lte?: number
  }
  export type Authorized = Base & {
    public_only?: boolean
  }
  export type Public = Base & {
    username: string
  }
}
