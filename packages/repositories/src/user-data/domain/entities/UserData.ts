type TreeNode<T> = T & {
  children: TreeNode<T>[]
}

export type UserData = {
  domains: {
    [domain: string]: {
      siteName: string
      bookmarks: string[]
    }
  }
  bookmarks: {
    [bookmarkId: string]: {
      title: string
      description?: string
      url: string
      urlParts: {
        scheme: string
        domain: string
        path: string[]
        queryString: string
        fragment: string
      }
      collections: string[]
    }
  }
  collections: {
    [collectionId: string]: {
      name: string
      parentId: string | null
      children: string[]
      bookmarks: string[]
    }
  }
  tree: TreeNode<{
    name?: string
    bookmarks: string[]
  }>
}
