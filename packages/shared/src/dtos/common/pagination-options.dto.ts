import { ApiProperty } from '@nestjs/swagger'

export class PaginationOptionsDto {
  @ApiProperty({
    description: 'Item id.',
  })
  after?: string
}
