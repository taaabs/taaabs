import { Bookmarks_Dto } from './bookmarks.dto'

export namespace FindByUrlHash_Dto {
  export type Body = {
    hash: string
  }
  export type Response = Bookmarks_Dto.Response.AuthorizedBookmark
}
