class Bookmark {
  url: string
  title: string
  description: string | null
}

export class CollectionDataResponseDto {
  bookmarks: Bookmark[]
}
