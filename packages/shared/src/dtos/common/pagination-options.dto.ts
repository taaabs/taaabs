import { ApiProperty } from '@nestjs/swagger'

export class PaginationQueryParamDto {
  @ApiProperty({
    description: 'Item id.',
  })
  after?: string
}
