import { CreateBookmark_Dto } from './create-bookmark.dto'

export namespace UpdateBookmark_Dto {
  export const body_schema = CreateBookmark_Dto.body_schema
  export type Body = CreateBookmark_Dto.Body
}
