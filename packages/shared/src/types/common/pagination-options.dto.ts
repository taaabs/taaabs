import { ApiProperty } from '@nestjs/swagger'

export class PaginationQueryParamsDto {
  @ApiProperty({
    description: 'Item id.',
  })
  public after?: number
}
