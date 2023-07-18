import { LibraryFilter } from '@shared/types/common/library-filter'
import { MonthsFetchingDefaults } from './months-fetching-defaults'
import { ToBoolean } from '@shared/decorators/to-boolean'
import { ApiProperty } from '@nestjs/swagger'

export namespace MonthsDto {
  export namespace QueryParams {
    class Base {
      public filter?: LibraryFilter = MonthsFetchingDefaults.Common.filter
      public category_id?: string
      public tags?: string
    }
    export class Authorized extends Base {
      @ToBoolean()
      public public_only?: boolean =
        MonthsFetchingDefaults.Authorized.publicOnly
    }
    export class Public extends Base {}
  }
  export namespace Response {
    class Month {
      public yymm: number
      @ApiProperty({ type: () => [String] })
      public tags: [string, number][]
      public bookmarks_count: number
      public starred_count?: number
      public nsfw_count?: number
    }

    class AuthorizedMonth extends Month {
      public public_count?: number
    }
    class PublicMonth extends Month {}

    export class Authorized {
      public months_of_bookmark_creation: AuthorizedMonth[]
      public months_of_url_creation: AuthorizedMonth[]
      public is_months_update_scheduled: boolean
    }
    export class Public {
      public months_of_bookmark_creation: PublicMonth[]
      public months_of_url_creation: PublicMonth[]
      public is_months_update_scheduled: boolean
    }
  }
}
