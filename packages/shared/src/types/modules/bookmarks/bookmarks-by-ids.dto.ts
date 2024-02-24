import { z } from 'zod'
import { Bookmarks_Dto } from './bookmarks.dto'

export namespace BookmarksByIds_Dto {
  export const body_schema = z.array(z.number().int())
  export type Body = z.infer<typeof body_schema>
  export namespace Response {
    export class Authorized {
      public bookmarks: Bookmarks_Dto.Response.AuthorizedBookmark[]
    }
    export class Public {
      public bookmarks: Bookmarks_Dto.Response.PublicBookmark[]
    }
  }
}
