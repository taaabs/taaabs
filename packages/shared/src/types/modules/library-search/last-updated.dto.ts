import { ToBoolean } from '@shared/decorators/to-boolean'

export namespace LastUpdated_Dto {
  export namespace QueryParams {
    class Base {
      @ToBoolean()
      public is_archived?: boolean
    }
    export class Authorized extends Base {
      @ToBoolean()
      public public_only?: boolean
    }
    export class Public extends Base {}
  }
  export class Response {
    public updated_at?: string
  }
}
