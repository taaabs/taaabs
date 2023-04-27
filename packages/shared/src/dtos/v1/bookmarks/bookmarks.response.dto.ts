import { PaginatedResponseDto } from '../../common/paginated-response.dto'

class Bookmark {
  isEncrypted: boolean
  title: string
  description: string | null
  url: string
  createdAt: string
  tags: string[]
  saves: number | null
  isStarred: boolean
  isPublic: boolean
}

export class BookmarksResponseDto extends PaginatedResponseDto {
  bookmarks: Bookmark[]
}
