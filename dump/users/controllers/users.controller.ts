import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PublicUserDataResponseDto } from '@taaabs/shared'
import { UsersService } from '../services/users.service'

@Controller({ path: 'users', version: '1' })
@ApiTags('Users')
export class UsersController {
  constructor(private _usersService: UsersService) {}

  @Get('public/:username')
  @ApiOperation({ summary: 'Get public user data' })
  public async getPublicUserData(
    @Param('username') username: string,
  ): Promise<PublicUserDataResponseDto> {
    return this._usersService.getPublicUserData({ username })
  }
}
