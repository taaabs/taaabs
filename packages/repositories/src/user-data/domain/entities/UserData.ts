type TreeNode<T> = T & {
  children: Array<TreeNode<T>>
}

export type UserData = {
  domains: {
    [domain: string]: {
      siteName: string
      bookmarks: Array<string>
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
        path: Array<string>
        queryString: string
        fragment: string
      }
      collections: Array<string>
    }
  }
  collections: {
    [collectionId: string]: {
      name: string
      parentId: string | null
      children: Array<string>
      bookmarks: Array<string>
    }
  }
  tree: TreeNode<{
    name?: string
    bookmarks: Array<string>
  }>
}
