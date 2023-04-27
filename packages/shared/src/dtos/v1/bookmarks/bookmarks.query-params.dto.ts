import { DateRange, PaginationOptionsDto, SortBy } from '../../common'

export class BookmarksOnUserQueryParamsDto extends PaginationOptionsDto {
  tags?: string
  date_range?: DateRange
  date_start?: string
  date_end?: string
  sort_by?: SortBy
}
