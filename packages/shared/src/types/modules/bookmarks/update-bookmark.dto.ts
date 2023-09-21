import { PartialType } from '@nestjs/swagger'
import { CreateBookmark_Dto } from './create-bookmark.dto'

export class UpdateBookmark_Dto extends PartialType(CreateBookmark_Dto) {}
