export namespace BookmarkEntity {
  type Bookmark = {
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

  export type OnCurrentUser = Bookmark & {
    isPublic: boolean
  }
  export type OnOtherUser = Bookmark
}
