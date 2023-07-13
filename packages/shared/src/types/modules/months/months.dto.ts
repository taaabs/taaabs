import { Months } from './months'

export namespace MonthsDto {
  export class QueryParams {
    public category_id: string
    public tags: string
    public filter: Months.Filter
  }
  export namespace QueryParams {}
  class Tag {
    public tag: string
    public yields: string
  }
  class Month {
    public yymm: number
    public tags: Array<Tag>
    public bookmarks_count: number
    public public_count?: number
    public starred_count?: number
    public nsfw_count?: number
  }
  export class Response {
    public months: Array<Month>
    public is_stale: boolean
  }
}
