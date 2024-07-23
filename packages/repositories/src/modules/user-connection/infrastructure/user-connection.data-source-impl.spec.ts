import { ToggleFollowing_Params } from '../domain/toggle-following.params'
import { CheckFollowing_Params } from '../domain/check-following.params'
import { ToggleFollowing_Dto } from '@shared/types/modules/users/toggle-following.dto'
import { CheckFollowing_Dto } from '@shared/types/modules/users/check-following.dto'
import { UserConnection_DataSourceImpl } from './user-connection.data-source-impl'
import { ky_instance_mock } from '../../../mocks/ky-instance-mock'

describe('UserConnection_DataSourceImpl', () => {
  let sut: UserConnection_DataSourceImpl

  beforeEach(() => {
    sut = new UserConnection_DataSourceImpl(ky_instance_mock)
    jest.clearAllMocks()
  })

  describe('[toggle_following]', () => {
    it('calls API correctly', async () => {
      const params: ToggleFollowing_Params = {
        username: 'test_username',
      }
      const body_mock: ToggleFollowing_Dto.Body = {
        username: params.username,
      }
      const response_mock: ToggleFollowing_Dto.Response = {
        is_following: true,
      }

      ky_instance_mock.post.mockImplementation(() => ({
        json: () => Promise.resolve(response_mock),
      }))

      const result = await sut.toggle_following(params)

      expect(ky_instance_mock.post).toHaveBeenCalledTimes(1)
      expect(ky_instance_mock.post).toHaveBeenCalledWith('v1/users/toggle-following', {
        json: body_mock,
      })
      expect(result).toEqual(response_mock)
    })
  })

  describe('[check_following]', () => {
    it('calls API correctly', async () => {
      const params: CheckFollowing_Params = {
        username: 'test-username',
      }
      const body_mock: CheckFollowing_Dto.Body = {
        username: params.username,
      }
      const response_mock: CheckFollowing_Dto.Response = {
        is_following: true,
      }

      ky_instance_mock.post.mockImplementation(() => ({
        json: () => Promise.resolve(response_mock),
      }))

      const result = await sut.check_following(params)

      expect(ky_instance_mock.post).toHaveBeenCalledTimes(1)
      expect(ky_instance_mock.post).toHaveBeenCalledWith('v1/users/check-following', {
        json: body_mock,
      })
      expect(result).toEqual(response_mock)
    })
  })
})
