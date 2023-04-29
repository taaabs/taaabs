import { ApiProperty } from '@nestjs/swagger'
import { DateRange, PaginationOptions_Dto, SortBy } from '../../common'
import { IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'

export class BookmarksOnUser_QueryParams_Dto extends PaginationOptions_Dto {
  static defaultDateRange = DateRange.ANY
  static defaultSortBy = SortBy.DATE_ASC

  @ApiProperty({
    description: 'Comma separated list of tags a bookmark must include.',
  })
  tags?: string
  
  date_range?: DateRange = BookmarksOnUser_QueryParams_Dto.defaultDateRange
  
  @ApiProperty({ description: 'Epoch timestamp in seconds.' })
  @Type()
  date_start?: number
  
  @ApiProperty({ description: 'Epoch timestamp in seconds.' })
  @Type()
  date_end?: number
  
  sort_by?: SortBy = BookmarksOnUser_QueryParams_Dto.defaultSortBy
  
  @Type()
  starred_only?: boolean
}
