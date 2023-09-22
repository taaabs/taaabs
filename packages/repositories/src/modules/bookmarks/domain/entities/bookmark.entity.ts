export namespace Bookmark_Entity {
  type Base = {
    id: string
    title: string
    note?: string
    created_at: string
    updated_at: string
    tags: { name: string; id: number }[]
    links: { url: string; public_saves: number; site_path?: string }[]
    is_starred: boolean
    is_nsfw: boolean
    render_height?: number
  }

  export type Authorized = Base & {
    is_public: boolean
  }
  export type Public = Base
}
