import { Bookmarks_Dto } from './bookmarks.dto'

export namespace BookmarksByIds_Dto {
  export class Body {
    public ids: number[]
  }
  export namespace Response {
    export class Authorized {
      public bookmarks: Bookmarks_Dto.Response.AuthorizedBookmark[]
    }
    export class Public {
      public bookmarks: Bookmarks_Dto.Response.PublicBookmark[]
    }
  }
}
