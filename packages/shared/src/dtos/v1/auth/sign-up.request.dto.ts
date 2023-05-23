import { IsEmail, MaxLength, MinLength } from 'class-validator'
import { systemValues } from '../../../constants'
import { ApiProperty } from '@nestjs/swagger'

export class SignUp_Request_Dto {
  @MaxLength(systemValues.usernameMaxLength)
  @MinLength(systemValues.usernameMinLength)
  username!: string

  @IsEmail()
  email!: string

  @MinLength(systemValues.passwordLength)
  @MaxLength(systemValues.passwordLength)
  @ApiProperty({
    description:
      'Passwords sent over the network are SHA256 hashes made of concatenated email and password',
  })
  password!: string
}
