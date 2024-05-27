export namespace BookmarkUrlHashData {
  export type Bookmark = {
    title?: string
    description?: string
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
    if (bookmark.description) {
      hash.set('note', bookmark.description)
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
    const note = hash.get('description')
    if (note) {
      bookmark.description = note
    }
    const links = hash.getAll('url')
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
