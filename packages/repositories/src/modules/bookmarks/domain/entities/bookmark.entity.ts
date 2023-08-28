export namespace BookmarkEntity {
  type Base = {
    id: string
    title: string
    note?: string
    url: string
    createdAt: string
    tags?: { name: string; id: number }[]
    sitePath?: string
    isStarred: boolean
    isNsfw: boolean
    saves: number
  }

  export type Authorized = Base & {
    isPublic: boolean
  }
  export type Public = Base
}
