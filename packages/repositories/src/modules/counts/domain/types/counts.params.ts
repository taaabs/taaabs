import { LibraryFilter } from '@shared/types/common/library-filter'

export namespace Counts_Params {
  type Base = {
    filter?: LibraryFilter
    category_id?: string
    tags?: string[]
  }
  export type Authorized = Base & {
    public_only?: boolean
  }
  export type Public = Base & {
    username: string
  }
}
