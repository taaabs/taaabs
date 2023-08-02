import { LibraryFilter } from '@shared/types/common/library-filter'

export namespace Months {
  export type Month = {
    tags: Record<string, number>
    bookmarksCount: number
    publicCount?: number
    starredCount?: number
    nsfwCount?: number
  }
  export type JsonKey = `${string /** category id */} ${LibraryFilter} ${
    string /** comma separated tags */
  }`
  export type Months = Record<string, Month>
  export type JsonValue = {
    monthsOfBookmarkCreation: Months
    monthsOfUrlCreation: Months
  }
  export type Json = Record<JsonKey, JsonValue>
}
