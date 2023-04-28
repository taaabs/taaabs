import { PaginatedResponse_Dto } from '../../common/paginated-response.dto'

class Bookmark {
  title: string
  description: string | null
  url: string
  createdAt: string
  tags: string[]
  isStarred: boolean
}

class BookmarkOnOtherUser extends Bookmark {
  site: string
  saves: number | null
}

class BookmarkOnCurrentUser extends Bookmark {
  site: string | null
  isPublic: boolean
  isEncrypted: boolean
}

export class BookmarksOnOtherUser_Response_Dto extends PaginatedResponse_Dto {
  bookmarks: BookmarkOnOtherUser[]
}

export class BookmarksOnCurrentUser_Response_Dto extends PaginatedResponse_Dto {
  bookmarks: BookmarkOnCurrentUser[]
}
