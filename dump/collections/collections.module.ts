import { PrismaModule } from '@/prisma.module'
import { Module } from '@nestjs/common'
import { CollectionsController } from './controllers/collections.controller'
import { CollectionsRepository } from './repositories/collections.repository'
import { CollectionsService } from './services/collections.service'

@Module({
  imports: [PrismaModule],
  controllers: [CollectionsController],
  providers: [CollectionsService, CollectionsRepository],
})
export class CollectionsModule {}
