import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { IsISO8601 } from 'class-validator'

class Collection {
  @ApiProperty()
  name: string

  @ApiProperty()
  id: string

  @ApiProperty()
  @IsOptional()
  parentId?: string

  @IsISO8601()
  updatedAt: string
}

export class SpaceDataResponseDto {
  @ApiProperty({ type: Collection, isArray: true })
  collections: Collection[] = []
}
