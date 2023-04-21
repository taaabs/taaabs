import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PublicSpaceDataResponseDto } from '@taaabs/shared'
import { SpacesService } from '../services/spaces.service'

@Controller({ path: 'spaces', version: '1' })
@ApiTags('Spaces')
export class SpacesController {
  constructor(private _spacesService: SpacesService) {}

  @Get('public/:username/:slug')
  @ApiOperation({
    summary: 'Get public space data',
  })
  public async getPublicSpaceData(
    @Param('username') username: string,
    @Param('slug') slug: string,
  ): Promise<PublicSpaceDataResponseDto> {
    return this._spacesService.getPublicSpaceData({ username, slug })
  }
}
