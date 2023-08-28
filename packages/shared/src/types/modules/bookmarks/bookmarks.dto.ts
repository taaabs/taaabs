import { PaginatedResponseDto } from '../../common/paginated-response.dto'
import { ApiProperty } from '@nestjs/swagger'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { PaginationQueryParamsDto } from '@shared/types/common/pagination-options.dto'
import { Type } from 'class-transformer'
import { ToBoolean } from '@shared/decorators/to-boolean'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { BookmarksFetchingDefaults } from './bookmarks-fetching-defaults'

export namespace BookmarksDto {
  export namespace QueryParams {
    export class Base extends PaginationQueryParamsDto {
      @ApiProperty({
        description: 'Comma separated list of tags a bookmark must include.',
        example: 'tagA,tagB,tagC',
      })
      public tags?: string

      public category_id?: string

      @ApiProperty({ description: 'Epoch timestamp in seconds.' })
      @Type()
      public epoch_gte?: number

      @ApiProperty({ description: 'Epoch timestamp in seconds.' })
      @Type()
      public epoch_lte?: number

      public sort_by?: SortBy = BookmarksFetchingDefaults.Common.sortBy

      public order_by?: OrderBy = BookmarksFetchingDefaults.Common.orderBy

      public filter?: LibraryFilter = BookmarksFetchingDefaults.Common.filter
    }

    export class Authorized extends Base {
      @ToBoolean()
      public public_only?: boolean =
        BookmarksFetchingDefaults.Authorized.publicOnly
    }

    export class Public extends Base {}
  }

  export namespace Response {
    class Tag {
      public name: string
      public id: number
    }

    class Bookmark {
      public id: string
      public title: string
      public note?: string
      public url: string
      public created_at: string
      public tags?: Tag[]
      public site_path?: string
      public is_starred?: boolean
      public is_nsfw?: boolean
      public saves?: number
    }

    class AuthorizedBookmark extends Bookmark {
      public is_public?: boolean
    }
    class PublicBookmark extends Bookmark {}

    export class Authorized extends PaginatedResponseDto {
      public bookmarks: AuthorizedBookmark[]
    }
    export class Public extends PaginatedResponseDto {
      public bookmarks: PublicBookmark[]
    }
  }
}
