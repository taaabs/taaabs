import { ApiProperty } from '@nestjs/swagger'

export class PaginationSearchParams {
  @ApiProperty({
    description: 'Item id inc.',
  })
  public after?: number
}
