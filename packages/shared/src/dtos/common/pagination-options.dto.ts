import { ApiProperty } from '@nestjs/swagger'

export class PaginationOptions_Dto {
  @ApiProperty({
    description: 'Item id.',
  })
  after?: string
}
