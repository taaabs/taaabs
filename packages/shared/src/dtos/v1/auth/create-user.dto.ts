import { IsEmail, Length, MaxLength, MinLength } from 'class-validator'
import { SystemValues } from '../../../constants'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUser_Dto {
  @MaxLength(SystemValues.USERNAME_MAX_LENGTH)
  @MinLength(SystemValues.USERNAME_MIN_LENGTH)
  username!: string

  @IsEmail()
  email!: string

  @MinLength(SystemValues.PASSWORD_LENGTH)
  @MaxLength(SystemValues.PASSWORD_LENGTH)
  @ApiProperty({
    description:
      'Passwords sent over the network are SHA256 hashes made of concatenated email and password',
  })
  password!: string
}
