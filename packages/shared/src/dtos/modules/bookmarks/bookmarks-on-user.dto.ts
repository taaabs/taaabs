import { ArchivedBookmarks } from '@shared/dtos/common/bookmarks/archived-bookmarks'
import { PaginatedResponseDto } from '../../common/paginated-response.dto'
import { ApiProperty } from '@nestjs/swagger'
import { DateRange } from '@shared/dtos/common/bookmarks/date-range'
import { SortBy } from '@shared/dtos/common/bookmarks/sort-by'
import { PaginationQueryParamsDto } from '@shared/dtos/common/pagination-options.dto'
import { Type } from 'class-transformer'
import { NsfwBookmarks } from '@shared/dtos/common/bookmarks/nsfw-bookmarks'
import { BookmarkVisibility } from '@shared/dtos/common/bookmarks/bookmark-visibility'

export namespace BookmarksOnUserDto {
  export namespace QueryParams {
    class QueryParams extends PaginationQueryParamsDto {
      static DEFAULT_DATE_RANGE = DateRange.ANY
      static DEFAULT_SORT_BY = SortBy.DATE_ASC
      static DEFAULT_ARCHIVED = ArchivedBookmarks.EXCLUDE
      static DEFAULT_NSFW = NsfwBookmarks.INCLUDE
      static DEFAULT_STARRED_ONLY = false

      @ApiProperty({
        description: 'Comma separated list of tags a bookmark must include.',
        example: 'tagA,tagB,tagC',
      })
      tags?: string

      category_id?: string

      date_range?: DateRange = QueryParams.DEFAULT_DATE_RANGE

      @ApiProperty({ description: 'Epoch timestamp in seconds.' })
      @Type()
      date_start?: number

      @ApiProperty({ description: 'Epoch timestamp in seconds.' })
      @Type()
      date_end?: number

      sort_by?: SortBy = QueryParams.DEFAULT_SORT_BY

      @ApiProperty({
        example: 'true',
      })
      @Type()
      starred_only?: boolean = QueryParams.DEFAULT_STARRED_ONLY

      archived?: ArchivedBookmarks = QueryParams.DEFAULT_ARCHIVED

      nsfw?: NsfwBookmarks = QueryParams.DEFAULT_NSFW
    }

    export class Authorized extends QueryParams {
      static DEFAULT_VISIBILITY = BookmarkVisibility.ALL

      visibility?: BookmarkVisibility = Authorized.DEFAULT_VISIBILITY
    }

    export class Public extends QueryParams {}
  }

  export namespace Response {
    class Bookmark {
      id: string
      title: string
      text?: string
      url: string
      created_at: string
      tags?: string[]
      site_path?: string
      is_starred?: boolean
      is_archived?: boolean
      is_nsfw?: boolean
      saves?: number
    }

    class BookmarkAll extends Bookmark {
      is_public?: boolean
    }
    class BookmarkPublic extends Bookmark {}

    export class Authorized extends PaginatedResponseDto {
      bookmarks: BookmarkAll[]
    }
    export class Public extends PaginatedResponseDto {
      bookmarks: BookmarkPublic[]
    }
  }
}
