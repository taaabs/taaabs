import { PaginatedResponseDto } from '../../common/paginated-response.dto'
import { ApiProperty } from '@nestjs/swagger'
import { DateRange } from '@shared/types/modules/bookmarks/date-range'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { Order } from '@shared/types/modules/bookmarks/order'
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

      public date_range?: DateRange = BookmarksFetchingDefaults.Common.dateRange

      @ApiProperty({ description: 'Epoch timestamp in seconds.' })
      @Type()
      public date_start?: number

      @ApiProperty({ description: 'Epoch timestamp in seconds.' })
      @Type()
      public date_end?: number

      public order_by?: OrderBy = BookmarksFetchingDefaults.Common.orderBy

      public order?: Order = BookmarksFetchingDefaults.Common.order

      public filter?: LibraryFilter = BookmarksFetchingDefaults.Common.filter
    }

    export class AuthorizedUser extends Base {
      @ToBoolean()
      public public_only?: boolean =
        BookmarksFetchingDefaults.AuthorizedUser.publicOnly
    }

    export class OtherUser extends Base {}
  }

  export namespace Response {
    class Bookmark {
      public id: string
      public title: string
      public text?: string
      public url: string
      public created_at: string
      public tags?: string[]
      public site_path?: string
      public is_starred?: boolean
      public is_archived?: boolean
      public is_nsfw?: boolean
      public saves?: number
    }

    class BookmarkAuthorized extends Bookmark {
      public is_public?: boolean
    }
    class BookmarkPublic extends Bookmark {}

    export class AuthorizedUser extends PaginatedResponseDto {
      public bookmarks: BookmarkAuthorized[]
    }
    export class OtherUser extends PaginatedResponseDto {
      public bookmarks: BookmarkPublic[]
    }
  }
}
