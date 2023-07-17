import { LibraryFilter } from '@shared/types/common/library-filter'

export namespace Months {
  export type Tag = {
    tag: string
    yields: number
  }
  export type Month = {
    tags: Tag[]
    bookmarksCount: number
    publicCount?: number
    starredCount?: number
    nsfwCount?: number
  }
  export enum Audience {
    Authorized = 'authorized',
    Public = 'public',
  }
  export type JsonKey = `${Audience} ${
    string /** category id */
  } ${LibraryFilter} ${string /** comma separated tags */}`
  export type Months = {
    [yymm: string]: Month
  }
  export type JsonValue = {
    monthsOfBookmarkCreation: Months
    monthsOfUrlCreation: Months
  }
  export type Json = {
    [key: JsonKey]: JsonValue
  }
}
