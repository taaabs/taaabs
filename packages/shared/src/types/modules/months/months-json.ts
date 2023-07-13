export namespace Months {
  export type Tag = {
    tag: string
    yields: number
  }
  export type Month = {
    yymm: string
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
  export enum Filter {
    All = 'all',
    AllNsfwExcluded = 'all-nsfw-excluded',
    StarredOnly = 'starred-only',
    StarredOnlyNsfwExcluded = 'starred-ony-nsfw-excluded',
    ArchivedOnly = 'archived-only',
    ArchivedOnlyNsfwExcluded = 'archived-only-nsfw-excluded',
  }
  export type Key = `${Audience} ${string} ${Filter} ${string}`
  export type Json = {
    [key: Key]: Month[]
  }
}
