import '@testing-library/jest-dom/extend-expect'

// Global mocks

// jest.mock('next/link', () => {
//   return ({ children }: { children: React.ReactNode }) => {
//     return children
//   }
// })

jest.mock('next/image', () => ({
  default: () => {
    return 'Next image'
  },
}))
