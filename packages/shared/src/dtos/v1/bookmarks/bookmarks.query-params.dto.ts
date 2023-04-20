import { SortOption } from '@/dtos/common'
import { PaginationOptions } from '../../../dtos/common'

export interface BookmarksOnUserQueryParams extends PaginationOptions {
  include?: string
  exclude?: string
  sort_by?: SortOption
}
