import { IsEmail, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { system_values } from '@shared/constants/system-values'

export class SignUpRequestDto {
  @MinLength(system_values.username_min_length)
  username: string

  @IsEmail()
  email: string

  @MinLength(system_values.password_length)
  @MaxLength(system_values.password_length)
  @ApiProperty({
    description:
      'Passwords sent over the network are SHA256 hashes made of concatenated email and password',
  })
  password: string
}
