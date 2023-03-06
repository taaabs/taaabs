class Bookmark {
  url: string
  title: string
  description: string | null
  host: string
}

export class PublicCollectionDataResponseDto {
  hosts: { [host: string]: { name: string } }
  bookmarks: Bookmark[]
}
