import { LibraryFilter } from '@shared/types/common/library-filter'

export namespace CountsFetchingDefaults {
  export namespace Common {
    export const filter = LibraryFilter.All
  }
  export namespace Authorized {
    export const public_only = false
  }
}
