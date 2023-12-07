import { ToBoolean } from '@shared/decorators/to-boolean'

export namespace LibrarySearchBookmarks_Dto {
  export namespace QueryParams {
    class Base {
      @ToBoolean()
      public is_archived?: boolean
    }
    export class Authorized extends Base {
      @ToBoolean()
      public public_only?: boolean
    }
    export class Public extends Base {}
  }

  export namespace Response {
    class Bookmark {
      public id: number
      public title: string
      public sites: string[]
      public created_at: number
      public updated_at: number
      public tags?: string[]
      public stars?: number
    }

    class AuthorizedBookmark extends Bookmark {
      public visited_at: number
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
