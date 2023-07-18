export namespace BookmarkEntity {
  type Base = {
    id: string
    title: string
    text: string | null
    url: string
    createdAt: string
    tags: string[]
    sitePath: string | null
    isStarred: boolean
    isArchived: boolean
    isNsfw: boolean
    saves: number
  }

  export type Authorized = Base & {
    isPublic: boolean
  }
  export type Public = Base
}
