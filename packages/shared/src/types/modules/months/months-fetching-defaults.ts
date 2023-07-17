import { LibraryFilter } from '@shared/types/common/library-filter'

export namespace MonthsFetchingDefaults {
  export namespace Common {
    export const filter = LibraryFilter.All
  }
  export namespace Authorized {
    export const publicOnly = false
  }
}
