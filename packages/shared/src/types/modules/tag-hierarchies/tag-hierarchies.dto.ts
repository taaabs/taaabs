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
  export namespace Response {
    export class Authorized {
      public tree: AuthorizedNode[]
    }
    export class Public {
      public tree: PublicNode[]
    }
  }
}
