import { Filter } from '@shared/types/common/filter'

export namespace Counts_Params {
  type Base = {
    filter?: Filter
    tags?: string[]
  }
  export type Authorized = Base & {
    public_only?: boolean
  }
  export type Public = Base & {
    username: string
  }
}
