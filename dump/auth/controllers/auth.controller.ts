import { UserCreationService } from '@/modules/users/services/user-creation.service'
import { Body, Controller, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { CreateUserDto } from '@taaabs/shared'
import { AuthService } from '../services/auth.service'

@Controller({ path: 'auth', version: '1' })
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private _authService: AuthService,
    private _userCreationService: UserCreationService,
  ) {}

  @Post('sign-up')
  @ApiOperation({
    summary: 'User registration',
    description: 'Register a new user.',
  })
  @ApiCreatedResponse({ description: 'User created.' })
  @ApiBadRequestResponse({
    description: 'Validation has failed.',
    // TODO
    // type: BadRequestExceptionDto
  })
  @ApiConflictResponse({ description: 'User already exists' })
  public async signUp(@Body() dto: CreateUserDto): Promise<void> {
    return await this._userCreationService.createUser(dto)
  }
}
