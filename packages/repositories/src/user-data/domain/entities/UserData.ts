export type Bookmark = {
  title: string
  description?: string
  url: string
  urlParts: {
    scheme: string
    domain: string
    path: Array<string>
    queryString: string
    fragment: string
  }
  collections: Array<string>
}

export type Collection = {
  name: string
}

export type UserData = {
  domains: {
    [domain: string]: {
      name: string
      bookmarks: Array<Bookmark>
    }
  }
  bookmarks: {
    [bookmarkId: string]: Bookmark
  }
  collections: {
    [collectionId: string]: {
      name: string
      bookmarks: Array<Bookmark>
    }
  }
}
