import { Type } from 'class-transformer'
import { ToBoolean } from '../../../../src/decorators/to-boolean'

export namespace LibrarySearchBookmarks_Dto {
  export class SearchParams {
    @ToBoolean()
    public is_archived?: boolean

    @Type()
    public after?: number // Select bookmarks updated after given timestamp in seconds.
  }

  export namespace Response {
    type AuthorizedLink = {
      site?: string
      site_aes?: string
      reader_data?: string
      reader_data_aes?: string
    }
    type AuthorizedTag = {
      id: number
      name?: string
      name_aes?: string
    }
    type Bookmark = {
      id: number
      title?: string
      note?: string
      created_at: number
      updated_at: number
      stars?: number
      points?: number
      is_deleted?: boolean
    }

    interface AuthorizedBookmark extends Bookmark {
      title_aes?: string
      note_aes?: string
      visited_at: number
      is_unsorted?: boolean
      links: AuthorizedLink[]
      tags: AuthorizedTag[]
    }

    type PublicTag = {
      id: number
      name: string
    }
    type PublicLink = {
      site: string
      reader_data?: string
    }
    interface PublicBookmark extends Bookmark {
      links: PublicLink[]
      tags: PublicTag[]
    }

    export type Authorized = {
      bookmarks: AuthorizedBookmark[]
      version: number
    }
    export type Public = {
      bookmarks: PublicBookmark[]
      version: number
    }
  }
}
