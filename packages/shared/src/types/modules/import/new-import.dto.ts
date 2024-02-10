export namespace NewImport_Dto {
  class Tag {
    public hash: string
    public name?: string
    public name_aes?: string
    public is_public?: boolean
  }
  class Link {
    public hash: string
    public url?: string
    public site?: string
    public url_aes?: string
    public site_aes?: string
    public is_public?: boolean
  }
  export class Bookmark {
    public title?: string
    public title_aes?: string
    public created_at: string
    public is_public?: boolean
    public is_archived?: boolean
    public stars?: number
    public is_unread?: boolean
    public tags?: Tag[]
    public links?: Link[]
    public note?: string
    public note_aes?: string
  }
  class TagHierarchyNode {
    public hash: string
    public children?: TagHierarchyNode[]
  }
  export class Body {
    public bookmarks: Bookmark[]
    public tree?: TagHierarchyNode[]
  }
}
