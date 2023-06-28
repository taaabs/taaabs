import { ApiProperty } from '@nestjs/swagger'

export class PaginationQueryParamsDto {
  @ApiProperty({
    description: 'Item id.',
  })
  after?: string
}
