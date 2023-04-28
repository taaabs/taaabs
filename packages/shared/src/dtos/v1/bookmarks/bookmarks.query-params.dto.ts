import { DateRange, PaginationOptions_Dto, SortBy } from '../../common'

export class BookmarksOnUser_QueryParams_Dto extends PaginationOptions_Dto {
  static defaultDateRange = DateRange.ANY
  static defaultSortBy = SortBy.DATE_ASC

  tags?: string
  date_range?: DateRange = BookmarksOnUser_QueryParams_Dto.defaultDateRange
  date_start?: string
  date_end?: string
  sort_by?: SortBy = BookmarksOnUser_QueryParams_Dto.defaultSortBy
  starred_only?: boolean
}
