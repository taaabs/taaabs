import { PrismaModule } from '@/prisma.module'
import { Module } from '@nestjs/common'
import { UsersController } from './controllers/users.controller'
import { UsersRepository } from './repositories/users.repository'
import { UserCreationService } from './services/user-creation.service'
import { UsersService } from './services/users.service'

@Module({
  imports: [PrismaModule],
  providers: [UsersService, UsersRepository, UserCreationService],
  controllers: [UsersController],
  exports: [UserCreationService, UsersService, UsersRepository],
})
export class UsersModule {}
