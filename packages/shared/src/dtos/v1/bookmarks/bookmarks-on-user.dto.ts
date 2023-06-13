import { ArchivedBookmarks } from '@shared/dtos/common/bookmarks/archived-bookmarks'
import { PaginatedResponseDto } from '../../common/paginated-response.dto'
import { ApiProperty } from '@nestjs/swagger'
import { DateRange } from '@shared/dtos/common/bookmarks/date-range'
import { SortBy } from '@shared/dtos/common/bookmarks/sort-by'
import { PaginationQueryParamDto } from '@shared/dtos/common/pagination-options.dto'
import { Type } from 'class-transformer'
import { NsfwBookmarks } from '@shared/dtos/common/bookmarks/nsfw-bookmarks'
import { BookmarkVisibility } from '@shared/dtos/common/bookmarks/bookmark-visibility'

export namespace BookmarksOnUserDto {
  export class QueryParams extends PaginationQueryParamDto {
    static defaultDateRange = DateRange.ANY
    static defaultSortBy = SortBy.DATE_ASC
    static defaultArchived = ArchivedBookmarks.EXCLUDE
    static defaultNsfw = NsfwBookmarks.INCLUDE
    static defaultStarredOnly = false
    static defaultVisibility = BookmarkVisibility.ALL

    @ApiProperty({
      description: 'Comma separated list of tags a bookmark must include.',
      example: 'tagA,tagB,tagC',
    })
    tags?: string

    category_id?: string

    date_range?: DateRange = QueryParams.defaultDateRange

    @ApiProperty({ description: 'Epoch timestamp in seconds.' })
    @Type()
    date_start?: number

    @ApiProperty({ description: 'Epoch timestamp in seconds.' })
    @Type()
    date_end?: number

    sort_by?: SortBy = QueryParams.defaultSortBy

    @Type()
    @ApiProperty({
      example: 'true',
    })
    starred_only?: boolean = QueryParams.defaultStarredOnly

    archived?: ArchivedBookmarks = QueryParams.defaultArchived

    nsfw?: NsfwBookmarks = QueryParams.defaultNsfw

    @Type()
    @ApiProperty({
      description: 'Applies to bookmarks on requester only.',
    })
    visibility?: BookmarkVisibility = QueryParams.defaultVisibility
  }

  export namespace Response {
    class Bookmark {
      id!: string
      title!: string
      text?: string
      url!: string
      createdAt!: string
      tags?: string[]
      isStarred?: boolean
      sitePath?: string
      isArchived?: boolean
      saves!: number
    }

    class BookmarkOnOtherUser extends Bookmark {}

    class BookmarkOnCurrentUser extends Bookmark {
      visibility!: 'public' | 'private'
    }

    export class OtherUser extends PaginatedResponseDto {
      bookmarks!: BookmarkOnOtherUser[]
    }

    export class CurrentUser extends PaginatedResponseDto {
      bookmarks!: BookmarkOnCurrentUser[]
    }
  }
}
