import { PaginatedResponse } from '../../common/paginated-response'
import { ApiProperty } from '@nestjs/swagger'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { Order } from '@shared/types/modules/bookmarks/order'
import { PaginationSearchParams } from '@shared/types/common/pagination-options'
import { Type } from 'class-transformer'
import { ToBoolean } from '@shared/decorators/to-boolean'

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
    public unread_only?: boolean

    @ToBoolean()
    public is_archived?: boolean
  }

  export namespace Response {
    class Link {
      public site_path?: string
    }
    class AuthorizedLink extends Link {
      public url?: string
      public url_aes?: string
      public site_aes?: string
      public is_public?: boolean
      public saves?: number
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
      public is_unread?: boolean
      public points?: number
    }

    export class AuthorizedBookmark extends Bookmark {
      public is_public?: boolean
      public title_aes?: string
      public links: AuthorizedLink[]
      public tags: AuthorizedTag[]
      public note_aes?: string
    }
    export class PublicBookmark extends Bookmark {
      public links: PublicLink[]
      public tags: PublicTag[]
    }

    export class Authorized extends PaginatedResponse {
      public bookmarks?: AuthorizedBookmark[]
      public awaits_processing?: boolean
      public processing_progress?: number
    }
    export class Public extends PaginatedResponse {
      public bookmarks?: PublicBookmark[]
      public awaits_processing?: boolean
      public processing_progress?: number
    }
  }
}
