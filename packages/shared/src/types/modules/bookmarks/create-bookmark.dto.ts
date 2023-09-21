class Tag {
  public name: string
  public is_public: boolean
}
class Link {
  public url: string
  public site_path: string
  public is_public: boolean
}

export class CreateBookmark_Dto {
  public title: string
  public created_at: Date
  public is_public: boolean
  public tags: Tag[]
  public links: Link[]
}
