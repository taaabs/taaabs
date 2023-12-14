class Tag {
  public name?: string
  public name_aes: string
  public hash: string
  public is_public?: boolean
}

class Link {
  public url?: string
  public url_aes?: string
  public site?: string
  public is_public: boolean
}

export class CreateBookmark_Dto {
  public title?: string
  public title_aes?: string
  public created_at?: string
  public is_public: boolean
  public is_archived?: boolean
  public stars?: number
  public is_unread?: boolean
  public tags: Tag[]
  public links: Link[]
}
