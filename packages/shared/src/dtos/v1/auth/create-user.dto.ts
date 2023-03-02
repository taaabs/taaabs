import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, Length, MaxLength, MinLength } from 'class-validator'
import { SystemValues } from '../../../constants'

export class CreateUserDto {
  @ApiProperty()
  @MaxLength(SystemValues.USERNAME_MAX_LENGTH)
  @MinLength(SystemValues.USERNAME_MIN_LENGTH)
  username: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @Length(SystemValues.PASSWORD_LENGTH)
  password: string
}
