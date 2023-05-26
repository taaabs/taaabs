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
  isArchived?: boolean
}

class BookmarkOnOtherUser extends Bookmark {}

class BookmarkOnCurrentUser extends Bookmark {
  visibility!: 'public' | 'unlisted' | 'secret'
  
}

export class BookmarksOnOtherUser_Response_Dto extends PaginatedResponse_Dto {
  bookmarks!: BookmarkOnOtherUser[]
}

export class BookmarksOnCurrentUser_Response_Dto extends PaginatedResponse_Dto {
  bookmarks!: BookmarkOnCurrentUser[]
}
