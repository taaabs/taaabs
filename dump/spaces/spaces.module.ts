import { PrismaModule } from '@/prisma.module'
import { Module } from '@nestjs/common'
import { SpacesController } from './controllers/spaces.controller'
import { SpacesRepository } from './repositories/spaces.repository'
import { SpacesService } from './services/spaces.service'

@Module({
  imports: [PrismaModule],
  controllers: [SpacesController],
  providers: [SpacesService, SpacesRepository],
})
export class SpacesModule {}
