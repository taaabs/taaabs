export namespace BookmarkEntity {
  type Bookmark = {
    id: string
    title: string
    text: string | null
    url: string
    createdAt: Date
    tags: string[]
    sitePath: string | null
    isStarred: boolean
    isArchived: boolean
    isNsfw: boolean
    saves: number
  }

  export type OnCurrentUser = Bookmark & {
    isPublic: boolean
  }
  export type OnOtherUser = Bookmark
}
