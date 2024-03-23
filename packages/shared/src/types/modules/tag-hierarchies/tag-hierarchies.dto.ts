import { ToBoolean } from '@shared/decorators/to-boolean'

export namespace TagHierarchies_Dto {
  class Node {
    public id: number
    public yields?: number
  }
  export class AuthorizedNode extends Node {
    public name?: string
    public name_aes?: string
    public children?: AuthorizedNode[]
  }
  export class PublicNode extends Node {
    public name: string
    public children?: PublicNode[]
  }
  export namespace SearchParams {
    class Base {
      @ToBoolean()
      public starred_only?: boolean

      @ToBoolean()
      public is_archived?: boolean

      public gte?: number
      public lte?: number
    }
    export class Authorized extends Base {
      @ToBoolean()
      public unread_only?: boolean
    }
    export class Public extends Base {}
  }
  export namespace Response {
    class Base {
      public total?: number
    }
    export class Authorized extends Base {
      public tree: AuthorizedNode[]
    }
    export class Public extends Base {
      public tree: PublicNode[]
    }
  }
}
