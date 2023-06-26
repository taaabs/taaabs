import { IsEmail, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { systemValues } from '@shared/constants/system-values'

export class SignUpRequestDto {
  @MinLength(systemValues.usernameMinLength)
  username: string

  @IsEmail()
  email: string

  @MinLength(systemValues.passwordLength)
  @MaxLength(systemValues.passwordLength)
  @ApiProperty({
    description:
      'Passwords sent over the network are SHA256 hashes made of concatenated email and password',
  })
  password: string
}
