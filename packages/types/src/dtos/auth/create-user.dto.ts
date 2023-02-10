import { ApiProperty } from '@nestjs/swagger'
// import z from 'zod'
import { IsEmail, MinLength } from 'class-validator'

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @MinLength(8)
  password: string
}

// export const createUserSchema = z.object({
//   email: z.string().email(),
//   name: z.string().nullable(),
//   password: z.string().min(8),
// })

// export type CreateUserDto2 = z.infer<typeof createUserSchema>
