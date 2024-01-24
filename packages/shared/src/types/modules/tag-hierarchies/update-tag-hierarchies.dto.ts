export namespace UpdateTagHierarchies_Dto {
  export class Node {
    public hash: string
    public children?: Node[]
  }

  export class Body {
    public tree: Node[]
  }
}
