import { UserConnection_RepositoryImpl } from './user-connection.repository-impl'
import { UserConnection_DataSource } from './user-connection.data-source'
import { ToggleFollowing_Params } from '../domain/toggle-following.params'
import { CheckFollowing_Params } from '../domain/check-following.params'
import { ToggleFollowing_Ro } from '../domain/toggle-following.ro'
import { CheckFollowing_Ro } from '../domain/check-following.ro'

describe('UserConnection_RepositoryImpl', () => {
  let data_source_mock: jest.Mocked<UserConnection_DataSource>
  let sut: UserConnection_RepositoryImpl

  beforeEach(() => {
    data_source_mock = {
      toggle_following: jest.fn(),
      check_following: jest.fn(),
    } as jest.Mocked<UserConnection_DataSource>
    sut = new UserConnection_RepositoryImpl(data_source_mock)
  })

  describe('[toggle_following]', () => {
    it('should call data source and return correct result', async () => {
      const params: ToggleFollowing_Params = {
        username: 'test_username',
      }
      const ro_mock: ToggleFollowing_Ro = {
        is_following: true,
      }

      data_source_mock.toggle_following.mockResolvedValue(ro_mock)

      const result = await sut.toggle_following(params)

      expect(data_source_mock.toggle_following).toHaveBeenCalledWith(params)
      expect(result).toEqual(ro_mock)
    })
  })

  describe('[check_following]', () => {
    it('should call data source and return correct result', async () => {
      const params: CheckFollowing_Params = {
        username: 'test_username',
      }
      const ro_mock: CheckFollowing_Ro = {
        is_following: true,
      }

      data_source_mock.check_following.mockResolvedValue(ro_mock)

      const result = await sut.check_following(params)

      expect(data_source_mock.check_following).toHaveBeenCalledWith(params)
      expect(result).toEqual(ro_mock)
    })
  })
})
