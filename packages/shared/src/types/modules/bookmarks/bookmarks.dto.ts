import { PaginatedResponseDto } from '../../common/paginated-response.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Sortby } from '@shared/types/modules/bookmarks/sortby'
import { Order } from '@shared/types/modules/bookmarks/order'
import { PaginationQueryParamsDto } from '@shared/types/common/pagination-options.dto'
import { Type } from 'class-transformer'
import { ToBoolean } from '@shared/decorators/to-boolean'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { BookmarksFetchingDefaults } from './bookmarks-fetching-defaults'

export namespace Bookmarks_Dto {
  export namespace QueryParams {
    export class Base extends PaginationQueryParamsDto {
      @ApiProperty({
        description: 'Comma separated list of tag ids a bookmark must include.',
        example: '1,2,3',
      })
      public tags?: string

      public category_id?: string

      @ApiProperty({ description: 'Epoch timestamp in seconds.' })
      @Type()
      public epoch_gte?: number

      @ApiProperty({ description: 'Epoch timestamp in seconds.' })
      @Type()
      public epoch_lte?: number

      public sort_by?: Sortby = BookmarksFetchingDefaults.Common.sortby

      public order?: Order = BookmarksFetchingDefaults.Common.order

      public filter?: LibraryFilter = BookmarksFetchingDefaults.Common.filter
    }

    export class Authorized extends Base {
      @ToBoolean()
      public public_only?: boolean =
        BookmarksFetchingDefaults.Authorized.public_only
    }

    export class Public extends Base {}
  }

  export namespace Response {
    class Link {
      public site?: string
      public saves?: number
    }

    class AuthorizedLink extends Link {
      public url?: string
      public url_aes?: string
      public site_aes?: string
      public is_public?: boolean
    }
    class PublicLink extends Link {
      public url: string
    }

    class Tag {
      public id: number
    }

    class AuthorizedTag extends Tag {
      public is_public?: boolean
      public name_aes?: string
    }
    class PublicTag extends Tag {
      public name: string
    }

    class Bookmark {
      public id: number
      public created_at: string
      public updated_at: string
      public visited_at: string
      public stars?: number
      public is_unread?: boolean
    }

    export class AuthorizedBookmark extends Bookmark {
      public title?: string
      public title_aes?: string
      public is_public?: boolean
      public links: AuthorizedLink[]
      public tags: AuthorizedTag[]
    }
    export class PublicBookmark extends Bookmark {
      public title: string
      public links: PublicLink[]
      public tags: PublicTag[]
    }

    export class Authorized extends PaginatedResponseDto {
      public bookmarks: AuthorizedBookmark[]
    }
    export class Public extends PaginatedResponseDto {
      public bookmarks: PublicBookmark[]
    }
  }
}
