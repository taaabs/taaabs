import { PaginatedResponseDto } from '../../common/paginated-response.dto'
import { ApiProperty } from '@nestjs/swagger'
import {
  ArchivedBookmarks,
  DateRange,
  PaginationOptionsDto,
  SortBy,
  BookmarkVisibility,
  NsfwBookmarks,
} from '../../common'
import { Type } from 'class-transformer'

export namespace BookmarksOnUserDto {
  export class QueryParams extends PaginationOptionsDto {
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
      description?: string
      url!: string
      createdAt!: string
      tags?: string[]
      isStarred?: boolean
      sitePath?: string
      isArchived?: boolean
    }

    class BookmarkOnOtherUser extends Bookmark {}

    class BookmarkOnCurrentUser extends Bookmark {
      visibility!: 'public' | 'unlisted' | 'secret'
    }

    export class OtherUser extends PaginatedResponseDto {
      bookmarks!: BookmarkOnOtherUser[]
    }

    export class CurrentUser extends PaginatedResponseDto {
      bookmarks!: BookmarkOnCurrentUser[]
    }
  }
}
