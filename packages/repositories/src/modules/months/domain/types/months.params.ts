import { LibraryFilter } from '@shared/types/common/library-filter'

export namespace MonthsParams {
  type Base = {
    filter?: LibraryFilter
    categoryId?: string
    tags?: string[]
  }
  export type Authorized = Base & {
    publicOnly?: boolean
  }
  export type Public = Base & {
    username: string
  }
}
