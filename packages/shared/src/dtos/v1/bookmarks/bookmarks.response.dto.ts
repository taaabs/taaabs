import { PaginatedResponse } from '../../common'

type Bookmark = {
  isEncrypted: boolean
  title: string
  description?: string
  url: string
  createdAt: string
  tags: string[]
}

export type BookmarksResponseDto = {
  bookmarks: Bookmark[]
} & PaginatedResponse
