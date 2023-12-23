import { ToBoolean } from '@shared/decorators/to-boolean'

export namespace LibrarySearchBookmarks_Dto {
  export class QueryParams {
    @ToBoolean()
    public is_archived?: boolean
  }
  export class Response {
    public index: string
  }
}
