import { ApiProperty } from '@nestjs/swagger'

export class PaginationQueryParams {
  @ApiProperty({
    description: 'Item id inc.',
  })
  public after?: number
}
