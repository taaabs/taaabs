import { ApiProperty } from '@nestjs/swagger'

class Bookmark {
  @ApiProperty()
  url: string

  @ApiProperty()
  title: string
}

export class GetCollectionDto {
  @ApiProperty({ type: Bookmark, isArray: true })
  bookmarks: Bookmark[] = []
}
