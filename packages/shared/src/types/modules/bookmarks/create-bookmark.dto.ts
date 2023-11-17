class Tag {
  public name: string
  public is_public?: boolean
}

class Link {
  public url: string
  public site_path?: string
  public is_public?: boolean
}

export class CreateBookmark_Dto {
  public title: string
  public created_at?: string
  public is_public?: boolean
  public is_archived?: boolean
  public stars?: number
  public is_unread?: boolean
  public tags: Tag[]
  public links: Link[]
}
