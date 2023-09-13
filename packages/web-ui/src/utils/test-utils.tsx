import '@testing-library/jest-dom'

// Global mocks
jest.mock('next/image', () => ({
  default: () => {
    return 'Next image'
  },
}))

jest.mock('react-blurhash', () => ({
  Blurhash: () => {
    return <div />
  },
}))
