import { UsersService } from '../services/users.service'
import { UsersController } from './users.controller'

const UsersServiceMock = jest.fn<UsersService, []>()

describe('UsersController', () => {
  describe('getPublicUserData', () => {
    it('calls "getPublicUserData" on service', async () => {
      const usersService = new UsersServiceMock()
      usersService.getPublicUserData = jest.fn().mockReturnValue('test')
      const sut = new UsersController(usersService)
      const username = 'test'
      const result = await sut.getPublicUserData(username)
      expect(usersService.getPublicUserData).toBeCalledWith({ username })
      expect(result).toBe('test')
    })
  })
})
