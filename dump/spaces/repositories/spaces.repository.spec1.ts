// import { PrismaService } from '@/prisma.service'
// import { SpacesRepository } from './spaces.repository'
// import { testPublicCollection, testUser } from '@/test/test-data'
// import { Test, TestingModule } from '@nestjs/testing'
// import { CollectionType, Prisma, StandardTypeVisibility } from '@prisma/client'

// describe('SpacesRepository', () => {
//   let prismaService: PrismaService

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         SpacesRepository,
//         {
//           provide: PrismaService,
//           useValue: {
//             user: {
//               findFirstOrThrow: jest.fn().mockResolvedValue(testUser),
//             },
//             space: {
//               findFirstOrThrow: jest.fn().mockResolvedValue({
//                 collections: [testPublicCollection],
//               }),
//             },
//           },
//         },
//       ],
//     }).compile()

//     prismaService = module.get<PrismaService>(PrismaService)
//   })

//   describe('publicCollectionsOnSpaceByUsernameAndSpaceSlug', () => {
//     it('correctly interacts with the db', async () => {
//       const sut = new SpacesRepository(prismaService)
//       const username = 'test-username'
//       const slug = 'test-slug'
//       const result = await sut.publicCollectionsOnSpaceByUsernameAndSpaceSlug({
//         username,
//         slug,
//       })

//       const userArgs: Prisma.UserFindFirstOrThrowArgs = { where: { username } }
//       expect(prismaService.user.findFirstOrThrow).toHaveBeenCalledWith(userArgs)

//       const spaceArgs: Prisma.SpaceFindFirstOrThrowArgs = {
//         where: { creatorId: testUser.id, slug },
//         select: {
//           collections: {
//             where: {
//               collectionType: CollectionType.STANDARD,
//               standardTypeVisibility: StandardTypeVisibility.PUBLIC,
//             },
//           },
//         },
//       }
//       expect(prismaService.space.findFirstOrThrow).toHaveBeenCalledWith(
//         spaceArgs,
//       )

//       expect(result).toStrictEqual([testPublicCollection])
//     })
//   })
// })
