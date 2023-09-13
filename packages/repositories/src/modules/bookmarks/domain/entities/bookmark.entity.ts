export namespace BookmarkEntity {
  type Base = {
    id: string
    title: string
    note?: string
    createdAt: string
    updatedAt: string
    tags: { name: string; id: number }[]
    links: { url: string; saves: number }[]
    isStarred: boolean
    isNsfw: boolean
    renderHeight?: number
  }

  export type Authorized = Base & {
    isPublic: boolean
  }
  export type Public = Base
}
