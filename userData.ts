export type UserEncryptedData = {
  domains: {
    [domain: string]: {
      name: string // needs to be scraped from html
    }
  }
  bookmarks: {
    [id: number]: {
      title: string
      excerpt?: string
      url: {
        protocol: string
        domain: string
        path: Array<string>
        parameters: string
        fragment: string
      }
      collections?: Array<number>
      tags?: Array<number>
      isFavourite?: boolean
      isPinned?: boolean
      isArchived?: boolean
      isTrashed?: boolean
      trashedAt?: boolean
    }
  }
  collections: {
    [id: number]: {
      name: string
      parentId: number | null
      emoji: string
    }
  }
  tags: {
    [id: number]: {
      name: string
      color: string
    }
  }
}

const dummy: UserEncryptedData = {
  domains: {
    'example.com': {
      name: 'Example',
    },
  },
  bookmarks: [],
  collections: [],
  tags: [],
}
