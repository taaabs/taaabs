import { ApiProperty } from '@nestjs/swagger'
import { IsISO8601 } from 'class-validator'

export class SpaceUpdatedAtResponseDto {
  @ApiProperty()
  @IsISO8601()
  updatedAt: string
}
