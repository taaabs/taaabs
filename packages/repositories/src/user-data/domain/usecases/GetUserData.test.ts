import { UserDataRepository } from '../repositories/UserDataRepository'
import { GetUserData } from './GetUserData'

describe('GetUserData', () => {
  it('calls repository', () => {
    const UserDataRepositoryMock = jest.fn<UserDataRepository, []>()
    const userDataRepositoryMock = new UserDataRepositoryMock()
    userDataRepositoryMock.getUserData = jest.fn()
    const sut = new GetUserData(userDataRepositoryMock)

    sut.invoke()

    expect(userDataRepositoryMock.getUserData).toHaveBeenCalled()
  })
})
