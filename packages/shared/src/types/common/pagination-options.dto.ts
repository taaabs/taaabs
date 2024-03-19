import { ApiProperty } from '@nestjs/swagger'

export class PaginationQueryParams_Dto {
  @ApiProperty({
    description: 'Item id inc.',
  })
  public after?: number
}
