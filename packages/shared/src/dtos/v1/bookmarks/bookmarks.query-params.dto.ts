import { IsOptional } from 'class-validator'
import { DateRange, PaginationOptions_Dto, SortBy } from '../../common'

export class BookmarksOnUser_QueryParams_Dto extends PaginationOptions_Dto {
  tags?: string
  date_range: DateRange = DateRange.ANY
  date_start?: string
  date_end?: string
  sort_by: SortBy = SortBy.DATE_ASC
  starred_only: boolean = false
}
