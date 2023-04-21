import { SortOption } from '../../common'
import { PaginationOptions } from '../../../dtos/common'

export interface BookmarksOnUserQueryParams extends PaginationOptions {
  tags?: string
  sort_by?: SortOption
}
