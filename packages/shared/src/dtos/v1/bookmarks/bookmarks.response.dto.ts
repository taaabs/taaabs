import { PaginatedResponse_Dto } from '../../common/paginated-response.dto'

class Bookmark {
  title!: string
  description?: string
  url!: string
  createdAt!: string
  tags?: string[]
  isStarred?: boolean
}

class BookmarkOnOtherUser extends Bookmark {
  site!: string
  saves!: number
}

class BookmarkOnCurrentUser extends Bookmark {
  site?: string
  saves?: number
  isPrivate?: boolean
  isEncrypted?: boolean
}

export class BookmarksOnOtherUser_Response_Dto extends PaginatedResponse_Dto {
  bookmarks!: BookmarkOnOtherUser[]
}

export class BookmarksOnCurrentUser_Response_Dto extends PaginatedResponse_Dto {
  bookmarks!: BookmarkOnCurrentUser[]
}
