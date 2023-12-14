export namespace LibrarySearchBookmarks_Dto {
  export namespace Response {
    class AuthorizedSite {
      public site?: string
      public site_aes?: string
    }
    class AuthorizedTag {
      public tag?: string
      public tag_aes?: string
    }
    class Bookmark {
      public id: number

      public created_at: number
      public updated_at: number
      public stars?: number
      public is_archived?: boolean
    }

    class AuthorizedBookmark extends Bookmark {
      public title?: string
      public title_aes?: string
      public visited_at: number
      public is_unread?: boolean
      public is_public?: boolean
      public sites: AuthorizedSite[]
      public tags: AuthorizedTag[]
    }

    class PublicBookmark extends Bookmark {
      public title: string
      public sites: string[]
      public tags: string[]
    }

    export class Authorized {
      public bookmarks: AuthorizedBookmark[]
    }
    export class Public {
      public bookmarks: PublicBookmark[]
    }
  }
}
