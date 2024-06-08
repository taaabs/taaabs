import { Type } from 'class-transformer'

export class PaginationSearchParams {
  @Type()
  public after?: number
}
