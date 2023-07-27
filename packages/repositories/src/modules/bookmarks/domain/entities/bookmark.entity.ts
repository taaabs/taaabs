export namespace BookmarkEntity {
  type Base = {
    id: string
    title: string
    text?: string
    url: string
    createdAt: string
    tags: string[]
    sitePath?: string
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
