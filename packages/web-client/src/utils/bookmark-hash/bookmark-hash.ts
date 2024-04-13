export namespace BookmarkHash {
  export type Bookmark = {
    title?: string
    note?: string
    links?: {
      url: string
      site_path?: string
    }[]
    tags?: string[]
  }
  export const stringify = (bookmark: Bookmark): string => {
    const hash = new URLSearchParams()
    if (bookmark.title) {
      hash.set('title', bookmark.title)
    }
    if (bookmark.note) {
      hash.set('note', bookmark.note)
    }
    if (bookmark.links) {
      bookmark.links.forEach((link) => {
        hash.set('link', link.url)
      })
    }
    if (bookmark.tags) {
      bookmark.tags.forEach((tag) => {
        hash.set('tag', tag)
      })
    }
    return hash.toString()
  }
  export const parse = (params: { hash: string }): Bookmark => {
    const bookmark: Bookmark = {}
    const hash = new URLSearchParams(params.hash)
    const title = hash.get('title')
    if (title) {
      bookmark.title = title
    }
    const note = hash.get('note')
    if (note) {
      bookmark.note = note
    }
    const links = hash.getAll('link')
    if (links) {
      links.forEach((link) => {
        bookmark.links = [
          ...(bookmark.links ? bookmark.links : []),
          { url: link },
        ]
      })
    }
    const tags = hash.getAll('tag')
    if (tags) {
      tags.forEach((tag) => {
        bookmark.tags = [...(bookmark.tags ? bookmark.tags : []), tag]
      })
    }
    return bookmark
  }
}
