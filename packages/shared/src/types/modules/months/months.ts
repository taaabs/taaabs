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
    OtherUser = 'otherUser',
  }
  export type Key = `${Audience} ${
    string /** category id */
  } ${LibraryFilter} ${string /** comma separated tags */}`
  export type Months = {
    [yymm: string]: Month
  }
  export type Json = {
    [key: Key]: {
      monthsOfBookmarksCreation: Months
      monthsOfUrlsCreation: Months
    }
  }
}
