import { PaginatedResponse } from '../../common/paginated-response'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { SortBy } from './sort-by'
import { Order } from './order'
import { ToBoolean } from '../../../../src/decorators/to-boolean'
import { PaginationSearchParams } from '../../../../src/types/common/pagination-options'

export namespace Bookmarks_Dto {
  export class SearchParams extends PaginationSearchParams {
    @ApiProperty({
      description: 'Comma separated list of tag ids a bookmark must include.',
      example: '1,2,3',
    })
    public tags?: string

    @ApiProperty({ description: 'Epoch timestamp in seconds.' })
    @Type()
    public epoch_gte?: number

    @ApiProperty({ description: 'Epoch timestamp in seconds.' })
    @Type()
    public epoch_lte?: number

    public sort_by?: SortBy

    public order?: Order

    @ToBoolean()
    public starred_only?: boolean

    @ToBoolean()
    public unsorted_only?: boolean

    @ToBoolean()
    public is_archived?: boolean
  }

  export namespace Response {
    class Link {
      public site_path?: string
      public is_pinned?: boolean
      public pin_title?: string
      public open_snapshot?: boolean
      public is_parsed?: boolean
    }
    class AuthorizedLink extends Link {
      public url?: string
      public url_aes?: string
      public site_aes?: string
      public is_public?: boolean
      public saves?: number
      public pin_title_aes?: string
      public favicon_aes?: string
    }
    class PublicLink extends Link {
      public url: string
      public saves: number
    }

    class Tag {
      public id: number
    }

    class AuthorizedTag extends Tag {
      public is_public?: boolean
      public name?: string
      public name_aes?: string
    }
    class PublicTag extends Tag {
      public name: string
    }

    class Bookmark {
      public id: number
      public title?: string
      public note?: string
      public created_at: string
      public updated_at: string
      public visited_at: string
      public stars?: number
      public is_unsorted?: boolean
      public points?: number
      public cover?: string
    }

    export class AuthorizedBookmark extends Bookmark {
      public is_public?: boolean
      public title_aes?: string
      public links: AuthorizedLink[]
      public tags: AuthorizedTag[]
      public note_aes?: string
      public cover_aes?: string
    }
    export class PublicBookmark extends Bookmark {
      public links: PublicLink[]
      public tags: PublicTag[]
    }

    export class Authorized extends PaginatedResponse {
      public bookmarks?: AuthorizedBookmark[]
      public processing_progress?: number
      public import_progress?: number
    }
    export class Public extends PaginatedResponse {
      public bookmarks?: PublicBookmark[]
      public processing_progress?: number
      public import_progress?: number
    }
  }
}
