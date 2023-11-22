export namespace LibrarySearchBookmarks_Dto {
  export namespace Response {
    class Bookmark {
      public id: number
      public title: string
      public sites: string
      public created_at: number
      public tags?: string[]
      public stars?: number
      public is_archived?: boolean
    }

    class AuthorizedBookmark extends Bookmark {
      public is_unread?: boolean
    }

    class PublicBookmark extends Bookmark {}

    export class Authorized {
      public bookmarks: AuthorizedBookmark[]
    }
    export class Public {
      public bookmarks: PublicBookmark[]
    }
  }
}
