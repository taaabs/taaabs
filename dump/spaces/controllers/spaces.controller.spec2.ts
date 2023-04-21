// import { SpacesService } from '../services/spaces.service'
// import { SpacesController } from './spaces.controller'

// const SpacesServiceMock = jest.fn<SpacesService, []>()

// describe('SpacesController', () => {
//   describe('getPublicSpaceData', () => {
//     it('calls "getPublicSpaceData" on service', async () => {
//       const spacesService = new SpacesServiceMock()
//       spacesService.getPublicSpaceData = jest.fn().mockReturnValue('test')
//       const sut = new SpacesController(spacesService)
//       const username = 'username'
//       const slug = 'slug'
//       const result = await sut.getPublicSpaceData(username, slug)
//       expect(spacesService.getPublicSpaceData).toBeCalledWith({
//         username,
//         slug,
//       })
//       expect(result).toBe('test')
//     })
//   })
// })
