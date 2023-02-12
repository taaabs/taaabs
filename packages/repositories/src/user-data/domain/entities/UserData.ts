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

type TreeNode<T> = T & {
  children: Array<TreeNode<T>>
}

type Collection = {
  name: string
  bookmarks: Array<Bookmark>
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
      parentId: string | null
      children: Array<string>
      bookmarks: Array<Bookmark>
    }
  }
  tree: TreeNode<Collection>
}
