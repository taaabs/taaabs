import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PublicCollectionDataResponseDto } from '@taaabs/shared'
import { CollectionsService } from '../services/collections.service'

@Controller({ path: 'collections', version: '1' })
@ApiTags('Collections')
export class CollectionsController {
  constructor(private _collectionsService: CollectionsService) {}

  @Get('public/:id')
  @ApiOperation({ summary: 'Get public collection data' })
  public async getPublicCollectionData(
    @Param('id') collectionId: string,
  ): Promise<PublicCollectionDataResponseDto> {
    return this._collectionsService.getPublicCollectionData({ collectionId })
  }
}
