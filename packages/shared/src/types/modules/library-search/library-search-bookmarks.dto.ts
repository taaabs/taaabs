import { ToBoolean } from '@shared/decorators/to-boolean'

export namespace LibrarySearchBookmarks_Dto {
  export class SearchParams {
    @ToBoolean()
    public is_archived?: boolean
  }
  export namespace Response {
    class AuthorizedLink {
      public site?: string
      public site_aes?: string
      public parsed_plain_text?: string
      public parsed_plain_text_aes?: string
    }
    class AuthorizedTag {
      public id: number
      public name?: string
      public name_aes?: string
    }
    class Bookmark {
      public id: number
      public title?: string
      public note?: string
      public created_at: number
      public updated_at: number
      public stars?: number
      public points?: number
      public is_deleted?: boolean
    }

    class AuthorizedBookmark extends Bookmark {
      public title_aes?: string
      public note_aes?: string
      public visited_at: number
      public is_unread?: boolean
      public links: AuthorizedLink[]
      public tags: AuthorizedTag[]
    }

    class PublicTag {
      public id: number
      public name: string
    }
    class PublicLink {
      public site: string
      public parsed_plain_text?: string
    }
    class PublicBookmark extends Bookmark {
      public links: PublicLink[]
      public tags: PublicTag[]
    }

    export class Authorized {
      public bookmarks: AuthorizedBookmark[]
      public version: number
    }
    export class Public {
      public bookmarks: PublicBookmark[]
      public version: number
    }
  }
}
