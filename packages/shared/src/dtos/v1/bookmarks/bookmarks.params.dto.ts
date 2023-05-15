import { ApiProperty } from '@nestjs/swagger'
import {
  ArchivedBookmarks,
  DateRange,
  PaginationOptions_Dto,
  SortBy,
} from '../../common'
import { Type } from 'class-transformer'

export class BookmarksOnUser_Params_Dto extends PaginationOptions_Dto {
  static defaultDateRange = DateRange.ANY
  static defaultSortBy = SortBy.DATE_ASC
  static defaultArchived = ArchivedBookmarks.EXCLUDE
  static defaultStarredOnly = false

  @ApiProperty({
    description: 'Comma separated list of tags a bookmark must include.',
    example: 'tagA,tagB,tagC',
  })
  tags?: string

  @ApiProperty({
    description: 'Tag bundles from folder hierarchy must be separated by "|".',
    example: 'js,dart|web,mobile|stable,cutting_edge',
  })
  bundles?: string

  date_range?: DateRange = BookmarksOnUser_Params_Dto.defaultDateRange

  @ApiProperty({ description: 'Epoch timestamp in seconds.' })
  @Type()
  date_start?: number

  @ApiProperty({ description: 'Epoch timestamp in seconds.' })
  @Type()
  date_end?: number

  sort_by?: SortBy = BookmarksOnUser_Params_Dto.defaultSortBy

  @Type()
  @ApiProperty({
    example: 'true',
  })
  starred_only?: boolean = BookmarksOnUser_Params_Dto.defaultStarredOnly

  archived?: ArchivedBookmarks = BookmarksOnUser_Params_Dto.defaultArchived
}
