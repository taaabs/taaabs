import { PaginatedResponse_Dto } from '../../common/paginated-response.dto'

class Bookmark {
  id!: string
  title!: string
  description?: string
  url!: string
  createdAt!: string
  tags?: string[]
  isStarred?: boolean
  sitePath?: string
}

class BookmarkOnOtherUser extends Bookmark {}

class BookmarkOnCurrentUser extends Bookmark {
  isPublic?: boolean
  isArchived?: boolean
  isEncrypted?: boolean
}

export class BookmarksOnOtherUser_Response_Dto extends PaginatedResponse_Dto {
  bookmarks!: BookmarkOnOtherUser[]
}

export class BookmarksOnCurrentUser_Response_Dto extends PaginatedResponse_Dto {
  bookmarks!: BookmarkOnCurrentUser[]
}
