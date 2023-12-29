import { Filter } from '@shared/types/common/filter'

export namespace CountsFetchingDefaults {
  export namespace Common {
    export const filter = Filter.All
  }
  export namespace Authorized {
    export const public_only = false
  }
}
