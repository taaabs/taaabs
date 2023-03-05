export class PaginatedResponseDto<T> {
  total: number
  limit: number
  offset: number
  results: T[]
}
