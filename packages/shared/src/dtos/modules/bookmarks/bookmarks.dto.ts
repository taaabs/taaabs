import { ArchivedBookmarks } from '@shared/dtos/modules/bookmarks/archived-bookmarks'
import { PaginatedResponseDto } from '../../common/paginated-response.dto'
import { ApiProperty } from '@nestjs/swagger'
import { DateRange } from '@shared/dtos/modules/bookmarks/date-range'
import { SortBy } from '@shared/dtos/modules/bookmarks/sort-by'
import { PaginationQueryParamsDto } from '@shared/dtos/common/pagination-options.dto'
import { Type } from 'class-transformer'
import { NsfwBookmarks } from '@shared/dtos/modules/bookmarks/nsfw-bookmarks'
import { BookmarkVisibility } from '@shared/dtos/modules/bookmarks/bookmark-visibility'
import { ToBoolean } from '@shared/decorators/to-boolean'

export namespace BookmarksDto {
  export namespace QueryParams {
    class QueryParams extends PaginationQueryParamsDto {
      public static DEFAULT_DATE_RANGE = DateRange.ANY
      public static DEFAULT_SORT_BY = SortBy.DATE_DESC
      public static DEFAULT_ARCHIVED = ArchivedBookmarks.EXCLUDE
      public static DEFAULT_NSFW = NsfwBookmarks.INCLUDE
      public static DEFAULT_STARRED_ONLY = false

      @ApiProperty({
        description: 'Comma separated list of tags a bookmark must include.',
        example: 'tagA,tagB,tagC',
      })
      public tags?: string

      public category_id?: string

      public date_range?: DateRange = QueryParams.DEFAULT_DATE_RANGE

      @ApiProperty({ description: 'Epoch timestamp in seconds.' })
      @Type()
      public date_start?: number

      @ApiProperty({ description: 'Epoch timestamp in seconds.' })
      @Type()
      public date_end?: number

      public sort_by?: SortBy = QueryParams.DEFAULT_SORT_BY

      @ToBoolean()
      public starred_only?: boolean = QueryParams.DEFAULT_STARRED_ONLY

      public archived?: ArchivedBookmarks = QueryParams.DEFAULT_ARCHIVED

      public nsfw?: NsfwBookmarks = QueryParams.DEFAULT_NSFW
    }

    export class Authorized extends QueryParams {
      public static DEFAULT_VISIBILITY = BookmarkVisibility.All

      public visibility?: BookmarkVisibility = Authorized.DEFAULT_VISIBILITY
    }

    export class Public extends QueryParams {}
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

    export class Authorized extends PaginatedResponseDto {
      public bookmarks: BookmarkAuthorized[]
    }
    export class Public extends PaginatedResponseDto {
      public bookmarks: BookmarkPublic[]
    }
  }
}
