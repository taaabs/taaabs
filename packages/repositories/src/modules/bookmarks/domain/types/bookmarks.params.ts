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
  }
  export type AuthorizedUser = {
    publicOnly?: boolean
  } & Base

  export type OtherUser = {
    username: string
  } & Base
}
