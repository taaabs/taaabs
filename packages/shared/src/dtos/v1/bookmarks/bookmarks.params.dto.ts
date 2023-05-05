import { ApiProperty } from '@nestjs/swagger'
import { DateRange, PaginationOptions_Dto, SortBy } from '../../common'
import { Type } from 'class-transformer'

export class BookmarksOnUser_Params_Dto extends PaginationOptions_Dto {
  static defaultDateRange = DateRange.ANY
  static defaultSortBy = SortBy.DATE_ASC

  @ApiProperty({
    description: 'Comma separated list of tags a bookmark must include.',
  })
  tags?: string

  @ApiProperty({
    description: `Tag bundles to match all combinations, for example
                  Langugage > Platform > Stability:
                  "js,dart|web,mobile|stable,cutting_edge"`,
  })
  bundles?: string

  date_range?: DateRange = BookmarksOnUser_Params_Dto.defaultDateRange

  @ApiProperty({ description: 'Epoch timestamp in seconds.' })
  @Type()
  date_start?: number

  @ApiProperty({ description: 'Epoch timestamp in seconds.' })
  @Type()
  date_end?: number

  @ApiProperty({
    description: 'Comma separated list of sites a bookmark can be from.',
  })
  sites?: string

  sort_by?: SortBy = BookmarksOnUser_Params_Dto.defaultSortBy

  @Type()
  starred_only?: boolean = false
}
