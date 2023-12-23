import { ToBoolean } from '@shared/decorators/to-boolean'

export namespace LibrarySearchBookmarks_Dto {
  export class QueryParams {
    @ToBoolean()
    public public_only?: boolean
    @ToBoolean()
    public is_archived?: boolean
  }
  export namespace Response {
    class AuthorizedSite {
      public site?: string
      public site_aes?: string
    }
    class AuthorizedTag {
      public name?: string
      public name_aes?: string
    }
    class Bookmark {
      public id: number
      public note?: string
      public created_at: number
      public updated_at: number
      public stars?: number
    }

    class AuthorizedBookmark extends Bookmark {
      public title?: string
      public title_aes?: string
      public note_aes?: string
      public visited_at: number
      public is_unread?: boolean
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
