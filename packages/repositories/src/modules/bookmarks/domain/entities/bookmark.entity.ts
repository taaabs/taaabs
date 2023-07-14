export namespace BookmarkEntity {
  type BookmarkBase = {
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

  export type AuthorizedUser = BookmarkBase & {
    isPublic: boolean
  }
  export type OtherUser = BookmarkBase
}
